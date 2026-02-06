import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { registrationSchema } from '@/lib/validators'
import { sendConfirmationEmail } from '@/lib/mailer'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateRegistrationId } from '@/lib/utils'

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
    const existingTeam = await prisma.team.findUnique({
      where: { teamName: data.teamName },
    })

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team name already exists. Please choose a different name.' },
        { status: 409 }
      )
    }

    // Check for duplicate member emails across all teams
    const memberEmails = data.members.map(m => m.email)
    const existingMembers = await prisma.member.findMany({
      where: {
        email: { in: memberEmails },
      },
      select: { email: true },
    })

    if (existingMembers.length > 0) {
      const duplicateEmails = existingMembers.map(m => m.email)
      return NextResponse.json(
        { 
          error: 'One or more team members are already registered with another team.',
          duplicates: duplicateEmails 
        },
        { status: 409 }
      )
    }

    // Generate unique registration ID
    const registrationId = generateRegistrationId()

    // Create team with members in a transaction
    const team = await prisma.team.create({
      data: {
        registrationId,
        teamName: data.teamName,
        department: data.department,
        leaderEmail: data.leaderEmail,
        leaderPhone: data.leaderPhone,
        agreedToRules: data.agreedToRules,
        members: {
          create: data.members.map((member, index) => ({
            name: member.name,
            email: member.email,
            phone: member.phone,
            rollNo: member.rollNo,
            year: member.year,
            isLeader: index === 0,
          })),
        },
      },
      include: {
        members: true,
      },
    })

    // Send confirmation email (async, don't block response)
    const leader = team.members.find(m => m.isLeader) || team.members[0]
    sendConfirmationEmail({
      teamName: team.teamName,
      registrationId: team.registrationId,
      leaderName: leader.name,
      leaderEmail: team.leaderEmail,
      department: team.department,
      members: team.members.map(m => ({
        name: m.name,
        email: m.email,
        rollNo: m.rollNo,
      })),
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      registrationId: team.registrationId,
      teamId: team.id,
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

    const team = await prisma.team.findUnique({
      where: { registrationId },
      include: {
        members: {
          orderBy: { isLeader: 'desc' },
        },
      },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      team: {
        registrationId: team.registrationId,
        teamName: team.teamName,
        department: team.department,
        leaderEmail: team.leaderEmail,
        status: team.status,
        createdAt: team.createdAt,
        members: team.members.map(m => ({
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
