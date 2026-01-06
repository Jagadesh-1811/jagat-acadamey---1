import React, { useState } from 'react'
import logo from '../../assets/logo.jpg'
import axios from 'axios'
import { serverUrl } from '../../App'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData, setToken } from '../../redux/userSlice'
import { auth, googleProvider, signInWithEmailAndPassword, sendEmailVerification, signOut } from '../../../utils/Firebase'
import { signInWithPopup } from 'firebase/auth'

function EducatorLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [checkStatusLoading, setCheckStatusLoading] = useState(false)
    const dispatch = useDispatch()

    // Approval status state for visual display
    const [approvalInfo, setApprovalInfo] = useState(null) // { status: 'pending' | 'rejected' | 'approved', note: string }

    const handleGoogleAuth = async () => {
        if (!agreeToTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy")
            return
        }
        setGoogleLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // Check if user exists in backend and verify they are an educator
            const idToken = await user.getIdToken()
            const response = await axios.post(
                serverUrl + "/api/auth/firebase-sync",
                { email: user.email },
                { headers: { Authorization: `Bearer ${idToken}` } }
            )

            // Verify the user is an educator
            if (response.data.user.role !== 'educator') {
                toast.error("This account is not registered as an educator. Please use the student login.")
                await signOut(auth)
                setGoogleLoading(false)
                return
            }

            // Check approval status
            const approvalStatus = response.data.user.approvalStatus || 'pending'
            if (approvalStatus === 'pending') {
                setApprovalInfo({ status: 'pending', note: '' })
                toast.info("Your educator account is pending admin approval.")
                await signOut(auth)
                setGoogleLoading(false)
                return
            }
            if (approvalStatus === 'rejected') {
                setApprovalInfo({ status: 'rejected', note: response.data.user.approvalNote || 'Not specified' })
                toast.error("Your educator application was rejected.")
                await signOut(auth)
                setGoogleLoading(false)
                return
            }

            dispatch(setUserData(response.data.user))
            dispatch(setToken(idToken))
            localStorage.setItem("token", idToken)
            navigate("/dashboard")
            toast.success("Educator Login Successful!")
        } catch (error) {
            console.error("Google Auth Error:", error)
            if (error.code === 'auth/popup-blocked') {
                toast.error("Popup was blocked. Please allow popups for this site.")
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Sign-in cancelled. Please try again.")
            } else if (error.response?.status === 404) {
                toast.error("No educator account found. Please sign up first.")
            } else {
                toast.error(error.response?.data?.message || "Login failed. Please try again.")
            }
        }
        setGoogleLoading(false)
    }

    const handleLogin = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email")
            return
        }
        if (!password.trim()) {
            toast.error("Please enter your password")
            return
        }

        setLoading(true)
        try {
            // 1. Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // 2. Check if email is verified
            if (!user.emailVerified) {
                await sendEmailVerification(user)
                toast.info("Email not verified. Verification email resent! Please check your inbox.")
                await signOut(auth)
                setLoading(false)
                return
            }

            // 3. Get ID token
            const idToken = await user.getIdToken()

            // 4. Sync with backend and verify educator role
            const response = await axios.post(
                serverUrl + "/api/auth/firebase-sync",
                { email },
                { headers: { Authorization: `Bearer ${idToken}` } }
            )

            // 5. Verify the user is an educator
            if (response.data.user.role !== 'educator') {
                toast.error("This account is not registered as an educator. Please use the student login.")
                await signOut(auth)
                setLoading(false)
                return
            }

            // 6. Check approval status
            const approvalStatus = response.data.user.approvalStatus || 'pending'
            if (approvalStatus === 'pending') {
                setApprovalInfo({ status: 'pending', note: '' })
                toast.info("Your educator account is pending admin approval.")
                await signOut(auth)
                setLoading(false)
                return
            }
            if (approvalStatus === 'rejected') {
                setApprovalInfo({ status: 'rejected', note: response.data.user.approvalNote || 'Not specified' })
                toast.error("Your educator application was rejected.")
                await signOut(auth)
                setLoading(false)
                return
            }

            // 7. Store token and user data
            dispatch(setUserData(response.data.user))
            dispatch(setToken(idToken))
            localStorage.setItem("token", idToken)

            navigate("/dashboard")
            toast.success("Educator Login Successful!")
        } catch (error) {
            console.error("Login Error:", error)
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                toast.error("Invalid email or password")
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Invalid password")
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many failed attempts. Please try again later.")
            } else if (error.response?.status === 404) {
                toast.error("No educator account found. Please sign up first.")
            } else {
                toast.error("Login failed. Please try again.")
            }
        }
        setLoading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin()
    }

    // Check approval status without full login
    const handleCheckStatus = async () => {
        if (!email.trim()) {
            toast.error("Please enter your email to check status")
            return
        }

        setCheckStatusLoading(true)
        setApprovalInfo(null)

        try {
            // Check with backend for educator status
            const response = await axios.get(
                `${serverUrl}/api/auth/educator-status?email=${encodeURIComponent(email)}`
            )

            const { approvalStatus, approvalNote, role } = response.data

            if (role !== 'educator') {
                toast.error("No educator account found with this email")
                setCheckStatusLoading(false)
                return
            }

            setApprovalInfo({
                status: approvalStatus,
                note: approvalNote || ''
            })

            if (approvalStatus === 'approved') {
                toast.success("Your account is approved! You can login now.")
            } else if (approvalStatus === 'pending') {
                toast.info("Your account is pending admin approval.")
            } else if (approvalStatus === 'rejected') {
                toast.error("Your application was rejected.")
            }

        } catch (error) {
            console.error("Check status error:", error)
            if (error.response?.status === 404) {
                toast.error("No educator account found with this email")
            } else {
                toast.error("Failed to check status. Please try again.")
            }
        }
        setCheckStatusLoading(false)
    }

    return (
        <div className='bg-[#1a1a2e] w-full min-h-screen flex items-center justify-center p-4'>
            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row'>

                {/* Left Side - Form */}
                <div className='w-full md:w-[55%] p-8 md:p-10'>

                    {/* Educator Badge */}
                    <div className='inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full mb-6'>
                        <SchoolIcon className='text-lg' />
                        <span className='font-semibold text-sm'>Educator Login</span>
                    </div>

                    {/* Approval Status Card */}
                    {approvalInfo && (
                        <div className={`w-full p-4 rounded-xl mb-6 ${approvalInfo.status === 'pending'
                            ? 'bg-yellow-50 border-2 border-yellow-400'
                            : approvalInfo.status === 'approved'
                                ? 'bg-green-50 border-2 border-green-400'
                                : 'bg-red-50 border-2 border-red-400'
                            }`}>
                            <div className='flex items-start gap-3'>
                                {approvalInfo.status === 'pending' ? (
                                    <AccessTimeIcon className='text-2xl text-yellow-600 mt-1' />
                                ) : approvalInfo.status === 'approved' ? (
                                    <CheckCircleIcon className='text-2xl text-green-600 mt-1' />
                                ) : (
                                    <CancelIcon className='text-2xl text-red-600 mt-1' />
                                )}
                                <div>
                                    <h3 className={`font-bold text-lg ${approvalInfo.status === 'pending'
                                        ? 'text-yellow-800'
                                        : approvalInfo.status === 'approved'
                                            ? 'text-green-800'
                                            : 'text-red-800'
                                        }`}>
                                        {approvalInfo.status === 'pending'
                                            ? '⏳ Account Pending Approval'
                                            : approvalInfo.status === 'approved'
                                                ? '✅ Account Approved!'
                                                : '❌ Application Rejected'}
                                    </h3>
                                    <p className={`text-sm mt-1 ${approvalInfo.status === 'pending'
                                        ? 'text-yellow-700'
                                        : approvalInfo.status === 'approved'
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                        }`}>
                                        {approvalInfo.status === 'pending'
                                            ? 'Your educator account is awaiting admin approval.'
                                            : approvalInfo.status === 'approved'
                                                ? 'Your account is approved! You can now login.'
                                                : `Reason: ${approvalInfo.note}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Header */}
                    <h1 className='text-2xl md:text-3xl font-bold text-black mb-1'>Welcome Back, Educator</h1>
                    <p className='text-gray-500 mb-8'>Login to manage your courses and students</p>

                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className='mb-5'>
                            <label htmlFor="email" className='block text-sm font-semibold text-black mb-2'>
                                Email
                            </label>
                            <input
                                id='email'
                                type="email"
                                className='w-full h-[50px] px-4 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-black transition-colors'
                                placeholder='Your professional email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        {/* Password Field */}
                        <div className='mb-5 relative'>
                            <label htmlFor="password" className='block text-sm font-semibold text-black mb-2'>
                                Password
                            </label>
                            <input
                                id='password'
                                type={show ? "text" : "password"}
                                className='w-full h-[50px] px-4 pr-12 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-black transition-colors'
                                placeholder='Enter your password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <button
                                type="button"
                                className='absolute right-4 top-[42px] text-gray-500 hover:text-black'
                                onClick={() => setShow(prev => !prev)}
                            >
                                {show ? <VisibilityOutlinedIcon style={{ fontSize: 22 }} /> : <VisibilityOffOutlinedIcon style={{ fontSize: 22 }} />}
                            </button>
                        </div>

                        {/* Terms & Conditions */}
                        <div className='flex items-start gap-3 mb-6'>
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className='w-5 h-5 mt-0.5 cursor-pointer accent-black rounded'
                            />
                            <label htmlFor="agreeTerms" className='text-sm text-gray-600'>
                                I agree to the{' '}
                                <Link to="/terms" className='text-black font-medium underline hover:text-gray-700'>
                                    Terms & Conditions
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className='text-black font-medium underline hover:text-gray-700'>
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className='w-full h-[50px] bg-black text-white font-semibold rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={loading || !agreeToTerms}
                        >
                            {loading ? <ClipLoader size={24} color='white' /> : "Login to Educator Account"}
                        </button>
                    </form>

                    {/* Check Status Button */}
                    <button
                        type="button"
                        onClick={handleCheckStatus}
                        className='w-full h-[40px] mt-3 bg-white text-black border-2 border-black font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={checkStatusLoading}
                    >
                        {checkStatusLoading ? <ClipLoader size={18} color='black' /> : <><AccessTimeIcon className='text-sm' /> Check Approval Status</>}
                    </button>

                    {/* Divider */}
                    <div className='flex items-center gap-4 my-6'>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                        <span className='text-gray-400 text-sm'>or</span>
                        <div className='flex-1 h-[1px] bg-gray-200'></div>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        className='w-full h-[50px] bg-white border-2 border-gray-200 text-black font-medium rounded-lg flex items-center justify-center gap-3 hover:border-black hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={googleLoading || !agreeToTerms}
                        onClick={handleGoogleAuth}
                    >
                        {googleLoading ? <ClipLoader size={24} color='black' /> : <><GoogleIcon style={{ fontSize: 22 }} /> Continue with Google</>}
                    </button>

                    {/* Forgot Password */}
                    <p className='text-center mt-6'>
                        <span
                            className='text-sm text-gray-500 hover:text-black cursor-pointer underline'
                            onClick={() => navigate("/forgotpassword")}
                        >
                            Forgot your password?
                        </span>
                    </p>

                    {/* Links */}
                    <div className='mt-6 pt-6 border-t border-gray-100 space-y-2'>
                        <p className='text-center text-sm text-gray-600'>
                            Don't have an educator account?{' '}
                            <span
                                className='text-black font-semibold underline cursor-pointer hover:text-gray-700'
                                onClick={() => navigate("/educator/signup")}
                            >
                                Sign up here
                            </span>
                        </p>
                        <p className='text-center text-xs text-gray-400'>
                            Are you a student?{' '}
                            <span
                                className='underline cursor-pointer hover:text-black'
                                onClick={() => navigate("/login")}
                            >
                                Student Login
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right Side - Branding */}
                <div className='hidden md:flex w-[45%] bg-black flex-col items-center justify-center p-10 text-center'>
                    <div className='bg-white p-4 rounded-2xl shadow-lg mb-6'>
                        <img src={logo} className='w-20 h-20 object-contain' alt="Jagat Academy" />
                    </div>

                    <h2 className='text-white text-2xl font-bold mb-2 text-center px-4'>JAGAT ACADEMY INTEGRATED E-LEARNING PLATFORM</h2>
                    <p className='text-gray-400 text-sm mb-8'>Educator Portal</p>

                    <div className='text-left'>
                        <p className='text-gray-400 text-sm mb-4'>Why become an educator?</p>
                        <ul className='space-y-2'>
                            <li className='text-white text-sm'>• Create and sell courses</li>
                            <li className='text-white text-sm'>• Reach thousands of students</li>
                            <li className='text-white text-sm'>• Track student progress</li>
                            <li className='text-white text-sm'>• Earn from your expertise</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EducatorLogin
