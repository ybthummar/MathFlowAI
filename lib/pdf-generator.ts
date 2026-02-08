import PDFDocument from 'pdfkit'
import { Team } from './firebase'

export interface PDFReceiptData {
  registrationId: string
  teamName: string
  department: string
  leaderEmail: string
  leaderPhone: string
  members: {
    name: string
    email: string
    rollNo: string
    year: string
    isLeader: boolean
  }[]
  createdAt: Date
}

export async function generateReceiptPDF(data: PDFReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })

      const chunks: Buffer[] = []
      
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header - Gradient effect with color blocks
      doc.rect(0, 0, doc.page.width, 120).fill('#8B5CF6')
      doc.rect(0, 100, doc.page.width, 20).fill('#3B82F6')

      // Event Title
      doc.fontSize(32)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('MathFlow AI', 0, 30, { align: 'center' })

      doc.fontSize(14)
        .fillColor('#E0E7FF')
        .font('Helvetica')
        .text('Registration Confirmation Receipt', 0, 70, { align: 'center' })

      doc.moveDown(2)

      // Registration ID Section
      doc.fontSize(11)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text('REGISTRATION ID', 50, 150)

      doc.fontSize(20)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text(data.registrationId, 50, 170)

      // Date
      doc.fontSize(10)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text(`Registered on: ${data.createdAt.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`, doc.page.width - 250, 150, { width: 200, align: 'right' })

      // Divider
      doc.strokeColor('#E5E7EB')
        .lineWidth(1)
        .moveTo(50, 210)
        .lineTo(doc.page.width - 50, 210)
        .stroke()

      // Team Details Section
      let yPos = 235

      doc.fontSize(16)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text('Team Details', 50, yPos)

      yPos += 30

      // Team Name Box
      doc.roundedRect(50, yPos, 250, 70, 5)
        .fillAndStroke('#F3F4F6', '#E5E7EB')

      doc.fontSize(10)
        .fillColor('#6B7280')
        .text('Team Name', 60, yPos + 15)

      doc.fontSize(14)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text(data.teamName, 60, yPos + 35, { width: 230 })

      // Department Box
      doc.roundedRect(320, yPos, 225, 70, 5)
        .fillAndStroke('#F3F4F6', '#E5E7EB')

      doc.fontSize(10)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text('Department', 330, yPos + 15)

      doc.fontSize(12)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text(data.department, 330, yPos + 35, { width: 205 })

      yPos += 95

      // Contact Information Section
      doc.fontSize(16)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text('Contact Information', 50, yPos)

      yPos += 30

      doc.fontSize(11)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text('Leader Email:', 50, yPos)

      doc.fontSize(11)
        .fillColor('#1F2937')
        .font('Helvetica')
        .text(data.leaderEmail, 150, yPos)

      yPos += 20

      doc.fontSize(11)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text('Leader Phone:', 50, yPos)

      doc.fontSize(11)
        .fillColor('#1F2937')
        .font('Helvetica')
        .text(data.leaderPhone, 150, yPos)

      yPos += 40

      // Team Members Section
      doc.fontSize(16)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text('Team Members', 50, yPos)

      yPos += 25

      // Table Header
      doc.roundedRect(50, yPos, doc.page.width - 100, 30, 3)
        .fill('#8B5CF6')

      doc.fontSize(10)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('Name', 60, yPos + 10)
        .text('Roll No', 260, yPos + 10)
        .text('Year', 360, yPos + 10)
        .text('Email', 430, yPos + 10)

      yPos += 35

      // Table Rows
      data.members.forEach((member, index) => {
        const bgColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF'
        
        doc.roundedRect(50, yPos, doc.page.width - 100, 35, 3)
          .fill(bgColor)

        doc.fontSize(10)
          .fillColor('#1F2937')
          .font(member.isLeader ? 'Helvetica-Bold' : 'Helvetica')
          .text(member.name + (member.isLeader ? ' ⭐' : ''), 60, yPos + 12, { width: 180 })

        doc.font('Helvetica')
          .text(member.rollNo, 260, yPos + 12)
          .text(member.year, 360, yPos + 12)
          .text(member.email, 430, yPos + 12, { width: 120 })

        yPos += 35
      })

      yPos += 20

      // Event Details Section
      doc.fontSize(16)
        .fillColor('#1F2937')
        .font('Helvetica-Bold')
        .text('Event Details', 50, yPos)

      yPos += 25

      const eventDetails = [
        { label: '📅  Date:', value: 'February 21, 2026' },
        { label: '⏰  Time:', value: '9:00 AM - 5:00 PM IST' },
        { label: '📍  Venue:', value: 'Seminar Hall 2nd Floor, CSPIT-A6 Building, CHARUSAT' },
        { label: '🎯  Rounds:', value: 'Round 1: Math Escape Room (60 min) | Round 2: AI Challenge (120 min)' },
      ]

      eventDetails.forEach(detail => {
        doc.fontSize(10)
          .fillColor('#6B7280')
          .font('Helvetica')
          .text(detail.label, 50, yPos)

        doc.fontSize(10)
          .fillColor('#1F2937')
          .font('Helvetica')
          .text(detail.value, 150, yPos, { width: 400 })

        yPos += 22
      })

      yPos += 15

      // Important Notes
      doc.roundedRect(50, yPos, doc.page.width - 100, 80, 5)
        .fillAndStroke('#FEF3C7', '#F59E0B')

      doc.fontSize(12)
        .fillColor('#92400E')
        .font('Helvetica-Bold')
        .text('⚠️  Important Reminders', 60, yPos + 12)

      doc.fontSize(9)
        .fillColor('#78350F')
        .font('Helvetica')
        .text('• Bring your college ID card and this receipt on the event day', 60, yPos + 32)
        .text('• Round 1: No electronic devices allowed | Round 2: All resources permitted', 60, yPos + 47)
        .text('• Report to the venue 30 minutes before the event starts', 60, yPos + 62)

      // Footer
      const footerY = doc.page.height - 80

      doc.strokeColor('#E5E7EB')
        .lineWidth(1)
        .moveTo(50, footerY)
        .lineTo(doc.page.width - 50, footerY)
        .stroke()

      doc.fontSize(9)
        .fillColor('#6B7280')
        .font('Helvetica')
        .text('MATH for AI Club | Contact: socialmedia.cspit.aiml@charusat.ac.in', 0, footerY + 15, { 
          align: 'center',
          width: doc.page.width
        })

      doc.fontSize(8)
        .fillColor('#9CA3AF')
        .text('This is a computer-generated receipt. For queries, contact the event coordinators.', 0, footerY + 30, { 
          align: 'center',
          width: doc.page.width
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
