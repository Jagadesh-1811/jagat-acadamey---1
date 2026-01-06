import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'


function ResetPassword() {
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [isValidSession, setIsValidSession] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    setIsValidSession(true)
                } else {
                    setIsValidSession(false)
                }
            } catch (error) {
                console.error("Session check error:", error)
                setIsValidSession(false)
            }
            setCheckingSession(false)
        }

        checkSession()

        // Listen for auth state changes (when user clicks the reset link)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsValidSession(true)
                setCheckingSession(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                throw error
            }

            toast.success("Password reset successfully!")

            // Sign out and redirect to login
            await supabase.auth.signOut()
            navigate("/login")
        } catch (error) {
            console.error("Password reset error:", error)
            toast.error(error.message || "Failed to reset password. Please try again.")
        }
        setLoading(false)
    }

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <ClipLoader size={50} color='black' />
            </div>
        )
    }

    if (!isValidSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Invalid or Expired Link
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <button
                        onClick={() => navigate("/forgotpassword")}
                        className="w-full bg-black text-white py-2 px-4 rounded-md font-medium"
                    >
                        Request New Link
                    </button>
                    <div
                        className="text-sm text-center mt-4 text-gray-600 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Reset Your Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter a new password below to regain access to your account.
                </p>

                <form className="space-y-5" onSubmit={handleResetPassword}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password (min 8 characters)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[black] focus:outline-none"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Re-enter new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[black] focus:outline-none"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[black] text-white py-2 rounded-md font-medium flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={25} color='white' /> : "Reset Password"}
                    </button>
                </form>

                <div
                    className="text-center text-sm mt-4 text-gray-600 cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
