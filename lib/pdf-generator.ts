import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import path from 'path'
import fs from 'fs'

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface PDFReceiptData {
  registrationId: string
  teamName: string
  department: string
  leaderEmail: string
  leaderPhone: string
  status: string
  members: {
    name: string
    email: string
    rollNo: string
    year: string
    isLeader: boolean
  }[]
  createdAt: Date
}

// ─── Design Tokens ─────────────────────────────────────────────────────────────

const C = {
  primary:        '#7C3AED',
  secondary:      '#3B82F6',
  textDark:       '#1F2937',
  textMuted:      '#6B7280',
  textLight:      '#9CA3AF',
  border:         '#E5E7EB',
  bgLight:        '#F9FAFB',
  bgCard:         '#F3F4F6',
  white:          '#FFFFFF',
  headerAccent:   '#E0E7FF',
  warnBg:         '#FEF3C7',
  warnBorder:     '#F59E0B',
  warnTitle:      '#92400E',
  warnBody:       '#78350F',
  statusApproved: { bg: '#DCFCE7', fg: '#166534' },
  statusPending:  { bg: '#FEF9C3', fg: '#854D0E' },
  statusRejected: { bg: '#FEE2E2', fg: '#991B1B' },
} as const

const PAGE_W = 595.28   // A4 width in points
const PAGE_H = 841.89   // A4 height
const M = 50            // margin
const CW = PAGE_W - 2 * M  // content width
const FOOTER_H = 65     // reserved for footer
const MAX_Y = PAGE_H - FOOTER_H - 10

// ─── Helpers ────────────────────────────────────────────────────────────────────

function statusStyle(status: string) {
  switch (status?.toUpperCase()) {
    case 'APPROVED':  return { ...C.statusApproved, label: 'APPROVED' }
    case 'REJECTED':  return { ...C.statusRejected, label: 'REJECTED' }
    case 'WAITLIST':  return { ...C.statusPending,  label: 'WAITLISTED' }
    default:          return { ...C.statusPending,  label: 'PENDING' }
  }
}

function safeDateStr(d: Date, opts: Intl.DateTimeFormatOptions): string {
  try { return d.toLocaleDateString('en-US', opts) } catch { return String(d) }
}

function safeTimeStr(d: Date): string {
  try { return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) } catch { return '' }
}

// ─── Generator ──────────────────────────────────────────────────────────────────

export async function generateReceiptPDF(data: PDFReceiptData): Promise<Buffer> {
  // Pre-generate QR code (optional — gracefully skip on failure)
  let qrPng: Buffer | null = null
  try {
    qrPng = await QRCode.toBuffer(data.registrationId, {
      width: 90,
      margin: 1,
      color: { dark: '#1F2937', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    })
  } catch { /* non-critical */ }

  // Load club logo
  let logoBuf: Buffer | null = null
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    logoBuf = fs.readFileSync(logoPath)
  } catch { /* non-critical — will skip logo */ }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: M, bottom: M, left: M, right: M },
        bufferPages: true,          // required for multi-page footer
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      let y = 0

      // ── Auto page-break helper ──
      const needSpace = (h: number) => {
        if (y + h > MAX_Y) {
          doc.addPage()
          y = M
        }
      }

      // ── Divider ──
      const divider = (atY: number) => {
        doc.strokeColor(C.border).lineWidth(0.75)
          .moveTo(M, atY).lineTo(PAGE_W - M, atY).stroke()
      }

      // ── Section heading ──
      const heading = (title: string): number => {
        needSpace(30)
        doc.fontSize(14).fillColor(C.textDark).font('Helvetica-Bold').text(title, M, y)
        return (y += 22)
      }

      // ═════════════════════════════════════════════════════════════════════════
      //  HEADER BANNER  (with logo)
      // ═════════════════════════════════════════════════════════════════════════
      doc.rect(0, 0, PAGE_W, 115).fill(C.primary)
      doc.rect(0, 100, PAGE_W, 15).fill(C.secondary)

      // Club logo (left of title)
      if (logoBuf) {
        try {
          doc.image(logoBuf, M, 12, { width: 55, height: 55 })
        } catch { /* skip if image format unsupported */ }
      }

      const titleX = logoBuf ? M + 65 : 0
      const titleW = logoBuf ? PAGE_W - M - 65 - M : PAGE_W
      const titleAlign = logoBuf ? 'left' as const : 'center' as const

      doc.fontSize(28).fillColor(C.white).font('Helvetica-Bold')
        .text('MathFlow AI', titleX, 16, { width: titleW, align: titleAlign })

      doc.fontSize(10).fillColor(C.headerAccent).font('Helvetica')
        .text('A Flagship Event by MATH for AI Club', titleX, 48, { width: titleW, align: titleAlign })

      doc.fontSize(11).fillColor(C.white).font('Helvetica-Bold')
        .text('REGISTRATION CONFIRMATION RECEIPT', 0, 80, { align: 'center' })

      y = 130

      // ═════════════════════════════════════════════════════════════════════════
      //  REGISTRATION ID  ·  STATUS  ·  DATE  ·  QR CODE
      // ═════════════════════════════════════════════════════════════════════════
      doc.fontSize(9).fillColor(C.textMuted).font('Helvetica')
        .text('REGISTRATION ID', M, y)
      doc.fontSize(18).fillColor(C.textDark).font('Helvetica-Bold')
        .text(data.registrationId, M, y + 14)

      // Status badge
      const st = statusStyle(data.status)
      const stW = doc.widthOfString(st.label) + 16
      doc.roundedRect(M, y + 40, stW, 18, 3).fill(st.bg)
      doc.fontSize(8).fillColor(st.fg).font('Helvetica-Bold')
        .text(st.label, M + 8, y + 45)

      // Date & time (right-aligned)
      const dateStr = safeDateStr(data.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })
      const timeStr = safeTimeStr(data.createdAt)
      const rightCol = PAGE_W - M - 200

      doc.fontSize(9).fillColor(C.textMuted).font('Helvetica')
        .text('REGISTERED ON', rightCol, y, { width: 110 })
      doc.fontSize(10).fillColor(C.textDark).font('Helvetica-Bold')
        .text(dateStr, rightCol, y + 14, { width: 115 })
      if (timeStr) {
        doc.fontSize(9).fillColor(C.textMuted).font('Helvetica')
          .text(timeStr, rightCol, y + 28, { width: 115 })
      }

      // QR Code
      if (qrPng) {
        doc.image(qrPng, PAGE_W - M - 72, y - 2, { width: 68, height: 68 })
      }

      y += 72
      divider(y); y += 14

      // ═════════════════════════════════════════════════════════════════════════
      //  TEAM DETAILS
      // ═════════════════════════════════════════════════════════════════════════
      needSpace(110)
      y = heading('Team Details')

      const boxH = 58
      // Team Name box
      doc.roundedRect(M, y, 240, boxH, 4).fillAndStroke(C.bgCard, C.border)
      doc.fontSize(9).fillColor(C.textMuted).font('Helvetica')
        .text('Team Name', M + 10, y + 10, { width: 220 })
      doc.fontSize(13).fillColor(C.textDark).font('Helvetica-Bold')
        .text(data.teamName, M + 10, y + 26, { width: 220, lineBreak: true })

      // Department box
      const deptX = M + 255
      const deptW = CW - 255
      doc.roundedRect(deptX, y, deptW, boxH, 4).fillAndStroke(C.bgCard, C.border)
      doc.fontSize(9).fillColor(C.textMuted).font('Helvetica')
        .text('Department', deptX + 10, y + 10, { width: deptW - 20 })
      doc.fontSize(11).fillColor(C.textDark).font('Helvetica-Bold')
        .text(data.department, deptX + 10, y + 26, { width: deptW - 20, lineBreak: true })

      y += boxH + 16

      // ═════════════════════════════════════════════════════════════════════════
      //  CONTACT INFORMATION
      // ═════════════════════════════════════════════════════════════════════════
      needSpace(70)
      y = heading('Contact Information')

      const infoRow = (label: string, value: string) => {
        doc.fontSize(10).fillColor(C.textMuted).font('Helvetica')
          .text(label, M, y, { width: 120, continued: false })
        doc.fontSize(10).fillColor(C.textDark).font('Helvetica')
          .text(value, M + 125, y, { width: CW - 125 })
        y += 17
      }

      infoRow('Leader Email:', data.leaderEmail)
      infoRow('Leader Phone:', data.leaderPhone)
      infoRow('Team Size:', `${data.members.length} Members`)
      y += 10

      // ═════════════════════════════════════════════════════════════════════════
      //  TEAM MEMBERS TABLE
      // ═════════════════════════════════════════════════════════════════════════
      needSpace(80)
      y = heading(`Team Members (${data.members.length})`)

      // Column layout
      const cols = { num: 28, name: 150, roll: 82, year: 62, email: CW - 28 - 150 - 82 - 62 }

      // Header row
      const thH = 26
      doc.roundedRect(M, y, CW, thH, 3).fill(C.primary)
      doc.fontSize(9).fillColor(C.white).font('Helvetica-Bold')
      let cx = M
      doc.text('#',       cx + 8,           y + 8, { width: cols.num })
      cx += cols.num
      doc.text('Name',    cx + 5,           y + 8, { width: cols.name })
      cx += cols.name
      doc.text('Roll No', cx + 5,           y + 8, { width: cols.roll })
      cx += cols.roll
      doc.text('Year',    cx + 5,           y + 8, { width: cols.year })
      cx += cols.year
      doc.text('Email',   cx + 5,           y + 8, { width: cols.email })
      y += thH + 1

      // Data rows (with page-break awareness)
      data.members.forEach((member, i) => {
        const rowH = 28
        needSpace(rowH + 2)

        const bg = i % 2 === 0 ? C.bgLight : C.white
        doc.roundedRect(M, y, CW, rowH, 2).fill(bg)

        const ty = y + 9
        doc.fontSize(9).fillColor(C.textDark)
        cx = M

        doc.font('Helvetica').text(String(i + 1), cx + 10, ty, { width: cols.num })
        cx += cols.num

        const nameLabel = member.isLeader ? `${member.name} [Leader]` : member.name
        doc.font(member.isLeader ? 'Helvetica-Bold' : 'Helvetica')
          .text(nameLabel, cx + 5, ty, { width: cols.name - 10, lineBreak: false })
        cx += cols.name

        doc.font('Helvetica')
          .text(member.rollNo, cx + 5, ty, { width: cols.roll - 10, lineBreak: false })
        cx += cols.roll

        doc.text(member.year, cx + 5, ty, { width: cols.year - 10, lineBreak: false })
        cx += cols.year

        doc.fontSize(8)
          .text(member.email, cx + 5, ty, { width: cols.email - 10, lineBreak: false })

        y += rowH + 1
      })

      y += 14

      // ═════════════════════════════════════════════════════════════════════════
      //  EVENT DETAILS
      // ═════════════════════════════════════════════════════════════════════════
      needSpace(120)
      y = heading('Event Details')

      const events: [string, string][] = [
        ['Date:',   'February 21, 2026'],
        ['Time:',   '9:00 AM - 5:00 PM IST'],
        ['Venue:',  'Seminar Hall 2nd Floor, CSPIT-A6 Building, CHARUSAT'],
        ['Rounds:', 'Round 1: Math Escape Room (60 min)  |  Round 2: AI Challenge (120 min)'],
      ]
      events.forEach(([label, value]) => {
        needSpace(22)
        doc.fontSize(10).fillColor(C.textMuted).font('Helvetica-Bold')
          .text(label, M + 5, y, { width: 55 })
        doc.fontSize(10).fillColor(C.textDark).font('Helvetica')
          .text(value, M + 65, y, { width: CW - 70 })
        y += 20
      })
      y += 8

      // ═════════════════════════════════════════════════════════════════════════
      //  IMPORTANT REMINDERS
      // ═════════════════════════════════════════════════════════════════════════
      const reminders = [
        'Bring your college ID card and this receipt on the event day.',
        'Round 1: No electronic devices allowed  |  Round 2: All resources permitted.',
        'Report to the venue 30 minutes before the event starts.',
      ]
      const remindH = 26 + reminders.length * 15
      needSpace(remindH + 8)

      doc.roundedRect(M, y, CW, remindH, 4).fillAndStroke(C.warnBg, C.warnBorder)
      doc.fontSize(11).fillColor(C.warnTitle).font('Helvetica-Bold')
        .text('Important Reminders', M + 12, y + 8)

      doc.fontSize(9).fillColor(C.warnBody).font('Helvetica')
      reminders.forEach((r, i) => {
        doc.text(`  •  ${r}`, M + 12, y + 26 + i * 15, { width: CW - 24 })
      })

      // ═════════════════════════════════════════════════════════════════════════
      //  ORGANIZER DETAILS
      // ═════════════════════════════════════════════════════════════════════════
      y += remindH + 20
      needSpace(110)
      y = heading('Organizer Details')

      // Faculty Coordinators
      doc.fontSize(10).fillColor(C.textMuted).font('Helvetica-Bold')
        .text('Faculty Coordinators:', M, y)
      y += 15
      doc.fontSize(9).fillColor(C.textDark).font('Helvetica')
        .text('Prof. Mukti Patel  |  Prof. Bhargav Shobhana', M + 10, y)
      y += 18

      // Core committee (compact single line)
      doc.fontSize(10).fillColor(C.textMuted).font('Helvetica-Bold')
        .text('Core Committee:', M, y)
      y += 15
      doc.fontSize(9).fillColor(C.textDark).font('Helvetica')
        .text('President: Yash Davda  |  Vice President: Dhwani Navadia  |  Secretary: Krish Singh  |  Treasurer: Hasti Bhalodiya', M + 10, y, { width: CW - 20 })
      y += 18

      // Website
      doc.fontSize(10).fillColor(C.textMuted).font('Helvetica-Bold')
        .text('Website Development:', M, y)
      y += 15
      doc.fontSize(9).fillColor(C.textDark).font('Helvetica')
        .text('Yug Thummar', M + 10, y)

      // ═════════════════════════════════════════════════════════════════════════
      //  FOOTER — rendered on every page
      // ═════════════════════════════════════════════════════════════════════════
      const range = doc.bufferedPageRange()
      const totalPages = range.count
      for (let p = range.start; p < range.start + totalPages; p++) {
        doc.switchToPage(p)
        const fy = PAGE_H - FOOTER_H

        doc.strokeColor(C.border).lineWidth(0.5)
          .moveTo(M, fy).lineTo(PAGE_W - M, fy).stroke()

        doc.fontSize(8).fillColor(C.textMuted).font('Helvetica')
          .text(
            'MATH for AI Club  |  CSPIT, CHARUSAT  |  socialmedia.cspit.aiml@charusat.ac.in',
            0, fy + 10, { align: 'center', width: PAGE_W },
          )

        doc.fontSize(7).fillColor(C.textLight)
          .text(
            `Computer-generated receipt — no signature required.  |  Page ${p - range.start + 1} of ${totalPages}`,
            0, fy + 24, { align: 'center', width: PAGE_W },
          )
      }

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
