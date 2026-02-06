import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build filter conditions
    const where: any = {}

    if (department && department !== 'all') {
      where.department = department
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { teamName: { contains: search, mode: 'insensitive' } },
        { registrationId: { contains: search, mode: 'insensitive' } },
        { leaderEmail: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get total count for pagination
    const total = await prisma.team.count({ where })

    // Fetch teams with members
    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          orderBy: { isLeader: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Get statistics
    const stats = await prisma.team.groupBy({
      by: ['status'],
      _count: true,
    })

    const departmentStats = await prisma.team.groupBy({
      by: ['department'],
      _count: true,
    })

    return NextResponse.json({
      success: true,
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        byStatus: stats.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {}),
        byDepartment: departmentStats.reduce((acc, d) => ({ ...acc, [d.department]: d._count }), {}),
        total,
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

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { status },
      include: { members: true },
    })

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

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

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
