import { NextRequest, NextResponse } from 'next/server'
import { teamsCollection, Team, Member } from '@/lib/firebase'
import { registrationSchema } from '@/lib/validators'
import { sendConfirmationEmail } from '@/lib/mailer'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateRegistrationId } from '@/lib/utils'
import { generateReceiptPDF } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limit
    const allowed = await checkRateLimit(ip, '/api/register')
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = registrationSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check for duplicate team name
    const existingTeamSnapshot = await teamsCollection
      .where('teamName', '==', data.teamName)
      .limit(1)
      .get()

    if (!existingTeamSnapshot.empty) {
      return NextResponse.json(
        { error: 'Team name already exists. Please choose a different name.' },
        { status: 409 }
      )
    }

    // Check for duplicate member emails across all teams
    const memberEmails = data.members.map(m => m.email)
    const teamsSnapshot = await teamsCollection.get()
    const existingEmails: string[] = []
    
    teamsSnapshot.forEach((doc) => {
      const teamData = doc.data() as Team
      teamData.members?.forEach(member => {
        if (memberEmails.includes(member.email)) {
          existingEmails.push(member.email)
        }
      })
    })

    if (existingEmails.length > 0) {
      return NextResponse.json(
        { 
          error: 'One or more team members are already registered with another team.',
          duplicates: existingEmails 
        },
        { status: 409 }
      )
    }

    // Generate unique registration ID
    const registrationId = generateRegistrationId()

    // Create team document
    const now = new Date()
    const members: Member[] = data.members.map((member, index) => ({
      name: member.name,
      email: member.email,
      phone: member.phone,
      rollNo: member.rollNo,
      year: member.year,
      isLeader: index === 0,
    }))

    const teamData: Omit<Team, 'id'> = {
      registrationId,
      teamName: data.teamName,
      department: data.department,
      leaderEmail: data.leaderEmail,
      leaderPhone: data.leaderPhone,
      agreedToRules: data.agreedToRules,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      members,
    }

    const docRef = await teamsCollection.add(teamData)

    // Generate PDF receipt and send confirmation email to team leader
    const leader = members.find(m => m.isLeader) || members[0]
    
    // Generate PDF receipt and send email (fire-and-forget, but log errors)
    generateReceiptPDF({
      registrationId,
      teamName: data.teamName,
      department: data.department,
      leaderEmail: data.leaderEmail,
      leaderPhone: data.leaderPhone,
      members: members.map(m => ({
        name: m.name,
        email: m.email,
        rollNo: m.rollNo,
        year: m.year,
        isLeader: m.isLeader,
      })),
      createdAt: now,
    })
      .then(pdfBuffer => {
        console.log(`PDF receipt generated for team "${data.teamName}" (${registrationId})`)
        // Send email with PDF attachment to all registered members
        return sendConfirmationEmail({
          teamName: data.teamName,
          registrationId,
          leaderName: leader.name,
          leaderEmail: data.leaderEmail,
          department: data.department,
          members: members.map(m => ({
            name: m.name,
            email: m.email,
            rollNo: m.rollNo,
          })),
          pdfReceipt: pdfBuffer,
        })
      })
      .then(result => {
        if (result.success) {
          console.log(`Confirmation email sent to ${data.leaderEmail} for team "${data.teamName}"`)
        } else {
          console.error(`Failed to send email to ${data.leaderEmail}:`, result.error)
        }
      })
      .catch(error => {
        console.error(`Email/PDF pipeline failed for team "${data.teamName}":`, error)
      })

    return NextResponse.json({
      success: true,
      registrationId,
      teamId: docRef.id,
      message: 'Team registered successfully!',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('id')

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      )
    }

    const snapshot = await teamsCollection
      .where('registrationId', '==', registrationId)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const doc = snapshot.docs[0]
    const team = doc.data() as Team

    // Convert Firestore Timestamp to ISO string for JSON serialization
    let createdAtISO: string
    const rawDate = team.createdAt as unknown
    if (rawDate && typeof rawDate === 'object' && 'toDate' in rawDate && typeof (rawDate as Record<string, unknown>).toDate === 'function') {
      createdAtISO = (rawDate as { toDate: () => Date }).toDate().toISOString()
    } else if (rawDate && typeof rawDate === 'object' && '_seconds' in rawDate) {
      createdAtISO = new Date((rawDate as { _seconds: number })._seconds * 1000).toISOString()
    } else {
      createdAtISO = new Date(rawDate as string | number).toISOString()
    }

    // Sort members with leader first
    const sortedMembers = [...team.members].sort((a, b) => 
      (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0)
    )

    return NextResponse.json({
      success: true,
      team: {
        registrationId: team.registrationId,
        teamName: team.teamName,
        department: team.department,
        leaderEmail: team.leaderEmail,
        status: team.status,
        createdAt: createdAtISO,
        members: sortedMembers.map(m => ({
          name: m.name,
          email: m.email,
          rollNo: m.rollNo,
          year: m.year,
          isLeader: m.isLeader,
        })),
      },
    })
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
