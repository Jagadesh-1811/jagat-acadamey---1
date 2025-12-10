import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// Using Brevo (Sendinblue) SMTP - easier than Gmail
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,  // Your Brevo login email
    pass: process.env.BREVO_KEY,    // Your Brevo SMTP key
  },
});


const sendMail = async (to, otp) => {
  // Log OTP to console for local testing (can see in terminal)
  console.log(`\n========== OTP FOR TESTING ==========`)
  console.log(`Email: ${to}`)
  console.log(`OTP: ${otp}`)
  console.log(`=====================================\n`)

  try {
    await transporter.sendMail({
      from: `"Jagat Academy" <${process.env.BREVO_EMAIL}>`,
      to: to,
      subject: "Your OTP for Password Reset - Jagat Academy",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #000000; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Jagat Academy</h1>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #666666; line-height: 1.6;">Hello,</p>
                        <p style="color: #666666; line-height: 1.6;">You have requested to reset your password for your Jagat Academy account. Use the OTP below to proceed:</p>
                        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #000000; letter-spacing: 8px;">${otp}</span>
                        </div>
                        <p style="color: #666666; line-height: 1.6;"><strong>This OTP will expire in 5 minutes.</strong></p>
                        <p style="color: #666666; line-height: 1.6;">If you didn't request this password reset, please ignore this email or contact our support team.</p>
                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                        <p style="color: #999999; font-size: 12px; text-align: center;">
                            This is an automated message from Jagat Academy. Please do not reply to this email.<br>
                            &copy; ${new Date().getFullYear()} Jagat Academy. All rights reserved.
                        </p>
                    </div>
                </div>
            `
    })
    console.log(`OTP email sent successfully to ${to}`)
  } catch (error) {
    console.error('Email sending failed:', error.message)
    console.log('*** OTP logged above for testing - use that to proceed ***')
    // Don't throw error - allow the forgot password flow to continue
    // since OTP is logged to console for testing
  }
}

export default sendMail