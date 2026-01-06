import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { sendPasswordResetEmail, auth } from '../../utils/Firebase'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setEmailSent(true)
      toast.success("Password reset email sent! Please check your inbox.")
    } catch (error) {
      console.error("Reset password error:", error)
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email.")
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email address.")
      } else {
        toast.error(error.message || "Failed to send reset email. Please try again.")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {emailSent ? <span className="text-4xl text-green-500"><CheckCircleIcon /></span> : <span className="text-blue-500 text-4xl"><LockIcon /></span>}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          {emailSent ? "Check Your Email" : "Forgot Password?"}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-8">
          {emailSent
            ? `We've sent a password reset link to ${email}. Click the link in the email to set a new password.`
            : "Enter your email address and we'll send you a link to reset your password."
          }
        </p>

        {!emailSent ? (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none transition-shadow"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 px-4 rounded-md font-medium cursor-pointer flex items-center justify-center transition-none"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Resend Link
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm text-gray-600 hover:text-black font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowBackIcon className="mr-1" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
