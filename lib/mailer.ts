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
}

export async function sendConfirmationEmail(data: RegistrationEmailData) {
  const { teamName, registrationId, leaderName, leaderEmail, department, members } = data
  
  const membersList = members
    .map((m, i) => `${i + 1}. ${m.name} (${m.rollNo})`)
    .join('\n')
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); border-radius: 16px 16px 0 0; padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎯 MathFlow AI</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Registration Confirmed!</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <p style="margin: 0; color: #166534; font-weight: 600;">✅ Your registration is successful!</p>
      </div>
      
      <h2 style="color: #1f2937; margin-bottom: 20px;">Registration Details</h2>
      
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Registration ID:</strong> <code style="background: #7c3aed; color: white; padding: 2px 8px; border-radius: 4px;">${registrationId}</code></p>
        <p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>
        <p style="margin: 5px 0;"><strong>Department:</strong> ${department}</p>
        <p style="margin: 5px 0;"><strong>Team Leader:</strong> ${leaderName}</p>
      </div>
      
      <h3 style="color: #1f2937;">Team Members</h3>
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        ${members.map((m, i) => `
          <p style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #7c3aed;">
            ${i + 1}. <strong>${m.name}</strong> - ${m.rollNo}
          </p>
        `).join('')}
      </div>
      
      <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <p style="margin: 0; color: #92400e;">📌 <strong>Important:</strong> Please save your Registration ID. You'll need it on the event day.</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">Event Date: February 21, 2026</p>
        <p style="color: #6b7280; font-size: 14px;">Venue: Main Auditorium</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 12px; text-align: center;">
        This is an automated email. Please do not reply.<br>
        For queries, contact us at events@mathflowai.com
      </p>
    </div>
  </div>
</body>
</html>
`

  // Send email to team leader
  const allEmails = [leaderEmail, ...members.map(m => m.email).filter(e => e !== leaderEmail)]
  
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MathFlow AI <noreply@resend.dev>',
      to: allEmails,
      subject: `✅ Registration Confirmed - ${teamName} | MathFlow AI`,
      html: emailHtml,
    })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending failed:', error)
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
        For queries, contact us at events@mathflowai.com
      </p>
    </div>
  </div>
</body>
</html>
`

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MathFlow AI <noreply@resend.dev>',
      to: email,
      subject: `${title} - ${teamName} | MathFlow AI`,
      html: emailHtml,
    })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}
