import { NextRequest, NextResponse } from 'next/server'
import { teamsCollection, Team } from '@/lib/firebase'
import { getSession } from '@/lib/auth'
import { statusUpdateSchema } from '@/lib/validators'
import { sendStatusUpdateEmail } from '@/lib/mailer'
import QRCode from 'qrcode'

// Middleware to check authentication
async function checkAuth() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session
}

// GET - Fetch all teams with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const search = searchParams.get('search')?.toLowerCase()
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch all teams
    const snapshot = await teamsCollection.orderBy('createdAt', 'desc').get()
    
    let teams: (Team & { id: string })[] = []
    snapshot.forEach((doc) => {
      teams.push({ id: doc.id, ...doc.data() } as Team & { id: string })
    })

    // Apply filters
    if (department && department !== 'all') {
      teams = teams.filter(t => t.department === department)
    }

    if (status && status !== 'all') {
      teams = teams.filter(t => t.status === status)
    }

    if (search) {
      teams = teams.filter(t => 
        t.teamName.toLowerCase().includes(search) ||
        t.registrationId.toLowerCase().includes(search) ||
        t.leaderEmail.toLowerCase().includes(search)
      )
    }

    const total = teams.length

    // Paginate
    const paginatedTeams = teams.slice((page - 1) * limit, page * limit)

    // Calculate statistics
    const allTeamsSnapshot = await teamsCollection.get()
    const allTeams: Team[] = []
    allTeamsSnapshot.forEach((doc) => {
      allTeams.push(doc.data() as Team)
    })

    const byStatus: Record<string, number> = {}
    const byDepartment: Record<string, number> = {}

    allTeams.forEach(team => {
      byStatus[team.status] = (byStatus[team.status] || 0) + 1
      byDepartment[team.department] = (byDepartment[team.department] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      teams: paginatedTeams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        byStatus,
        byDepartment,
        total: allTeams.length,
      },
    })
  } catch (error) {
    console.error('Admin fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update team status
export async function PATCH(request: NextRequest) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validationResult = statusUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { teamId, status } = validationResult.data

    const docRef = teamsCollection.doc(teamId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    await docRef.update({ 
      status, 
      updatedAt: new Date() 
    })

    const updatedDoc = await docRef.get()
    const team = { id: updatedDoc.id, ...updatedDoc.data() } as Team & { id: string }

    // Send status update email
    if (status !== 'PENDING') {
      sendStatusUpdateEmail(
        team.leaderEmail,
        team.teamName,
        status as 'APPROVED' | 'REJECTED' | 'WAITLIST'
      ).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      team,
    })
  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Generate QR code for team badge
export async function POST(request: NextRequest) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { teamId } = await request.json()

    const docRef = teamsCollection.doc(teamId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    const team = doc.data() as Team

    // Generate QR code data
    const qrData = JSON.stringify({
      registrationId: team.registrationId,
      teamName: team.teamName,
      department: team.department,
      memberCount: team.members.length,
    })

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#7c3aed',
        light: '#ffffff',
      },
    })

    return NextResponse.json({
      success: true,
      qrCode,
      team: {
        registrationId: team.registrationId,
        teamName: team.teamName,
        department: team.department,
      },
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
