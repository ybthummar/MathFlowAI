import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface TeamMember {
  name: string
  email: string
  rollNo: string
}

interface RegistrationEmailData {
  teamName: string
  registrationId: string
  leaderName: string
  leaderEmail: string
  department: string
  members: TeamMember[]
  pdfReceipt?: Buffer
}

export async function sendConfirmationEmail(data: RegistrationEmailData) {
  const { teamName, registrationId, leaderName, leaderEmail, department, members, pdfReceipt } = data
  
  const membersList = members
    .map((m, i) => `${i + 1}. ${m.name} (${m.rollNo})`)
    .join('\n')
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - MathFlow AI</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border-radius: 16px 16px 0 0; padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 32px;">🎯 MathFlow AI</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">A flagship event by MATH for AI</p>
      <p style="color: rgba(255,255,255,0.95); margin-top: 15px; font-size: 18px; font-weight: 600;">✅ Registration Confirmed!</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">Dear <strong>${leaderName}</strong>,</p>
      
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <p style="margin: 0; color: #166534; font-weight: 600;">🎉 Congratulations! Your team has been successfully registered for MathFlow AI.</p>
      </div>
      
      <h2 style="color: #1f2937; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px;">📋 Registration Details</h2>
      
      <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 140px;">Registration ID:</td>
            <td style="padding: 8px 0;"><code style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: white; padding: 4px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;">${registrationId}</code></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Team Name:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${teamName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Department:</td>
            <td style="padding: 8px 0; color: #1f2937;">${department}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Team Leader:</td>
            <td style="padding: 8px 0; color: #1f2937;">${leaderName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Leader Email:</td>
            <td style="padding: 8px 0; color: #1f2937;">${leaderEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Team Size:</td>
            <td style="padding: 8px 0; color: #1f2937;">${members.length} Members</td>
          </tr>
        </table>
      </div>
      
      <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 10px;">👥 Team Members</h3>
      <div style="background: #f9fafb; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        ${members.map((m, i) => `
          <div style="margin: 8px 0; padding: 10px 12px; background: white; border-radius: 6px; border-left: 4px solid ${i === 0 ? '#7c3aed' : '#2563eb'}; display: flex; align-items: center;">
            <span style="background: ${i === 0 ? '#7c3aed' : '#e5e7eb'}; color: ${i === 0 ? 'white' : '#374151'}; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 12px;">${i + 1}</span>
            <div>
              <strong style="color: #1f2937;">${m.name}</strong>${i === 0 ? ' <span style="background: #7c3aed; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">LEADER</span>' : ''}<br>
              <span style="color: #6b7280; font-size: 13px;">Roll No: ${m.rollNo} | ${m.email}</span>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <p style="margin: 0 0 8px 0; color: #92400e; font-weight: 600;">📌 Important Instructions:</p>
        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
          <li>Save your Registration ID - you'll need it on event day</li>
          <li>All team members must carry valid college ID cards</li>
          <li>📄 Download and print the attached PDF receipt</li>
          <li>Report at the venue 30 minutes before the event</li>
          <li>Late arrivals may lead to disqualification</li>
        </ul>
      </div>
      
      <div style="background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
        <p style="margin: 0; color: #5b21b6; font-weight: 600; font-size: 16px;">🗓️ Event Details</p>
        <p style="margin: 10px 0 5px 0; color: #1f2937; font-size: 18px; font-weight: 700;">February 21, 2026</p>
        <p style="margin: 0; color: #4b5563;">9:00 AM - 5:00 PM IST</p>
        <p style="margin: 10px 0 0 0; color: #4b5563;">📍 Seminar Hall 2nd Floor, CSPIT-A6 Building, CHARUSAT</p>
      </div>
      
      <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <p style="margin: 0; color: #0369a1; font-size: 14px;">💰 <strong>Prize Pool:</strong> ₹10,000 (1st: ₹5,000 | 2nd: ₹3,000 | 3rd: ₹2,000)</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
      
      <p style="color: #6b7280; font-size: 12px; text-align: center; margin-bottom: 10px;">
        This is an automated confirmation email from MATH for AI.<br>
        For any queries, contact us at <a href="mailto:socialmedia.cspit.aiml@charusat.ac.in" style="color: #7c3aed;">socialmedia.cspit.aiml@charusat.ac.in</a>
      </p>
      
      <p style="color: #9ca3af; font-size: 11px; text-align: center;">
        © 2026 MATH for AI - MathFlow AI Event. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`

  // Send email to team leader only
  try {
    const fromAddress = 'MATH for AI <onboarding@resend.dev>'
    
    const emailOptions: any = {
      from: fromAddress,
      to: [leaderEmail],
      subject: `✅ Registration Confirmed - ${teamName} | MathFlow AI`,
      html: emailHtml,
      reply_to: 'socialmedia.cspit.aiml@charusat.ac.in',
      text: `Your team ${teamName} is registered successfully for MathFlow AI. Registration ID: ${registrationId}`,
    }

    // Attach PDF receipt if provided
    if (pdfReceipt) {
      emailOptions.attachments = [
        {
          filename: `MathFlowAI-Receipt-${registrationId}.pdf`,
          content: pdfReceipt.toString('base64'),
        },
      ]
    }

    const result = await resend.emails.send(emailOptions)
    
    if (result.error) {
      console.error('Resend API error:', JSON.stringify(result.error, null, 2))
      return { success: false, error: result.error }
    }
    
    console.log('Email sent successfully to', leaderEmail, 'ID:', result.data?.id)
    return { success: true, data: result.data }
  } catch (error: any) {
    console.error('Email sending failed:', error?.message || error)
    console.error('From: MATH for AI <onboarding@resend.dev>')
    console.error('To:', leaderEmail)
    return { success: false, error }
  }
}

export async function sendStatusUpdateEmail(
  email: string,
  teamName: string,
  status: 'APPROVED' | 'REJECTED' | 'WAITLIST'
) {
  const statusMessages = {
    APPROVED: {
      title: '🎉 Team Approved!',
      message: 'Congratulations! Your team has been approved for MathFlow AI!',
      color: '#22c55e',
    },
    REJECTED: {
      title: '❌ Registration Not Approved',
      message: 'We regret to inform you that your team registration could not be approved at this time.',
      color: '#ef4444',
    },
    WAITLIST: {
      title: '⏳ Added to Waitlist',
      message: 'Your team has been added to the waitlist. We will notify you if a spot becomes available.',
      color: '#f59e0b',
    },
  }

  const { title, message, color } = statusMessages[status]

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Registration Status Update</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border-radius: 16px 16px 0 0; padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">MathFlow AI</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
      <div style="border-left: 4px solid ${color}; padding-left: 15px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; margin: 0;">${title}</h2>
        <p style="color: #6b7280; margin-top: 10px;">${message}</p>
      </div>
      
      <p><strong>Team:</strong> ${teamName}</p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 12px; text-align: center;">
        For queries, contact us at socialmedia.cspit.aiml@charusat.ac.in
      </p>
    </div>
  </div>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: 'MATH for AI <onboarding@resend.dev>',
      to: email,
      subject: `${title} - ${teamName} | MathFlow AI`,
      html: emailHtml,
    })
    
    if (result.error) {
      console.error('Resend API error:', JSON.stringify(result.error, null, 2))
      return { success: false, error: result.error }
    }
    
    console.log('Status email sent to', email, 'ID:', result.data?.id)
    return { success: true, data: result.data }
  } catch (error: any) {
    console.error('Status email sending failed:', error?.message || error)
    return { success: false, error }
  }
}
