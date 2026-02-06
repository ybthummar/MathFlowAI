import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')

    // Build filter conditions
    const where: any = {}

    if (department && department !== 'all') {
      where.department = department
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Fetch all teams with members
    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          orderBy: { isLeader: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV content
    const headers = [
      'Registration ID',
      'Team Name',
      'Department',
      'Status',
      'Leader Email',
      'Leader Phone',
      'Member Count',
      'Member 1 Name',
      'Member 1 Email',
      'Member 1 Roll No',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Roll No',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Roll No',
      'Member 4 Name',
      'Member 4 Email',
      'Member 4 Roll No',
      'Member 5 Name',
      'Member 5 Email',
      'Member 5 Roll No',
      'Registered At',
    ]

    const rows = teams.map(team => {
      const memberData = []
      for (let i = 0; i < 5; i++) {
        const member = team.members[i]
        if (member) {
          memberData.push(member.name, member.email, member.rollNo)
        } else {
          memberData.push('', '', '')
        }
      }

      return [
        team.registrationId,
        team.teamName,
        team.department,
        team.status,
        team.leaderEmail,
        team.leaderPhone,
        team.members.length.toString(),
        ...memberData,
        new Date(team.createdAt).toISOString(),
      ]
    })

    // Escape and format CSV
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
