import { NextRequest, NextResponse } from 'next/server'
import { teamsCollection, Team } from '@/lib/firebase'
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
      // Sort members with leader first
      const sortedMembers = [...team.members].sort((a, b) => 
        (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0)
      )

      const memberData = []
      for (let i = 0; i < 5; i++) {
        const member = sortedMembers[i]
        if (member) {
          memberData.push(member.name, member.email, member.rollNo)
        } else {
          memberData.push('', '', '')
        }
      }

      const createdAt = team.createdAt instanceof Date 
        ? team.createdAt 
        : new Date(team.createdAt)

      return [
        team.registrationId,
        team.teamName,
        team.department,
        team.status,
        team.leaderEmail,
        team.leaderPhone,
        team.members.length.toString(),
        ...memberData,
        createdAt.toISOString(),
      ]
    })

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="mathflow-ai-registrations-${new Date().toISOString().split('T')[0]}.csv"`,
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
