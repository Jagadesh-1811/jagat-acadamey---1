// Mail.js - Placeholder file
// Email sending is now handled by Supabase for:
// - Signup email verification
// - Password reset emails
// 
// This file can be used for other transactional emails if needed in the future.
// For now, it exports empty functions to prevent import errors.

import dotenv from "dotenv"
dotenv.config()

console.log('📧 Email service: Using Supabase for authentication emails')

// Placeholder function - not used since Supabase handles emails
const sendMail = async (to, otp) => {
  console.log('Note: OTP emails are now handled by Supabase')
  return true
}

// Placeholder function - not used since Supabase handles emails
const sendVerificationEmail = async (to, verificationToken, frontendUrl) => {
  console.log('Note: Verification emails are now handled by Supabase')
  return true
}

export { sendVerificationEmail }
export default sendMail