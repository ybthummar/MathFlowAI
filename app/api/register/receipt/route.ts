import { NextRequest, NextResponse } from 'next/server'
import { teamsCollection, Team } from '@/lib/firebase'
import { generateReceiptPDF } from '@/lib/pdf-generator'

/**
 * Safely convert Firestore Timestamp / serialized timestamp / Date / string
 * into a plain JavaScript Date.
 */
function toJSDate(value: unknown): Date {
  if (value instanceof Date) return value
  // Firestore Admin Timestamp (has `.toDate()`)
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as Record<string, unknown>).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  // Serialized Firestore Timestamp `{ _seconds, _nanoseconds }`
  if (value && typeof value === 'object' && '_seconds' in value) {
    return new Date((value as { _seconds: number })._seconds * 1000)
  }
  return new Date(value as string | number)
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

    // Basic format check to avoid unnecessary DB hits
    if (!/^MFA-[A-Z0-9]+-[A-Z0-9]+$/i.test(registrationId)) {
      return NextResponse.json(
        { error: 'Invalid registration ID format' },
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

    // Sort members — leader first
    const sortedMembers = [...team.members].sort((a, b) =>
      (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0)
    )

    const pdfBuffer = await generateReceiptPDF({
      registrationId: team.registrationId,
      teamName: team.teamName,
      department: team.department,
      leaderEmail: team.leaderEmail,
      leaderPhone: team.leaderPhone,
      status: team.status,
      members: sortedMembers.map(m => ({
        name: m.name,
        email: m.email,
        rollNo: m.rollNo,
        year: m.year,
        isLeader: m.isLeader,
      })),
      createdAt: toJSDate(team.createdAt),
    })

    const uint8Array = new Uint8Array(pdfBuffer)

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="MathFlowAI-Receipt-${registrationId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}
