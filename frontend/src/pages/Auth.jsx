import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData, setToken } from '../redux/userSlice'
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from '../../utils/Firebase'
import { signInWithPopup } from 'firebase/auth'

function Auth() {
    // Toggle between 'login' and 'signup' modes
    const [mode, setMode] = useState("login")

    // Form fields
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // Role is now fixed to 'student' - educators use /educator/signup
    const role = "student"
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    // UI states
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        if (!agreeToTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy")
            return
        }
        setGoogleLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user
            const response = await axios.post(serverUrl + "/api/auth/googlesignup", {
                name: user.displayName,
                email: user.email,
                role: role || "user"
            })
            dispatch(setUserData(response.data.user))
            dispatch(setToken(response.data.token))
            navigate("/")
            toast.success(mode === "login" ? "Login Successfully with Google" : "Sign Up Successfully with Google")
        } catch (error) {
            console.error("Google Auth Error:", error)
            if (error.code === 'auth/admin-restricted-operation') {
                toast.error("Google Sign-In is not enabled. Please enable it in Firebase Console.")
            } else if (error.code === 'auth/popup-blocked') {
                toast.error("Popup was blocked. Please allow popups for this site.")
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Sign-in cancelled. Please try again.")
            } else if (error.code) {
                toast.error(`Firebase Error: ${error.code}`)
            } else {
                toast.error(error.response?.data?.message || "Google authentication failed. Please try again.")
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
                // Sign out so they can't access until verified
                await signOut(auth)
                setLoading(false)
                return
            }

            // 3. Get ID token
            const idToken = await user.getIdToken()

            // 4. Sync with backend
            const response = await axios.post(
                serverUrl + "/api/auth/firebase-sync",
                { email },
                { headers: { Authorization: `Bearer ${idToken}` } }
            )

            // 5. Store token and user data
            dispatch(setUserData(response.data.user))
            dispatch(setToken(idToken)) // Store Firebase ID token
            localStorage.setItem("token", idToken)

            navigate("/")
            toast.success("Login Successfully")
        } catch (error) {
            console.error("Login Error:", error)
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                toast.error("Invalid email or password")
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Invalid password")
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many failed attempts. Please try again later.")
            } else {
                toast.error("Login failed. Please try again.")
            }
        }
        setLoading(false)
    }

    const handleSignUp = async () => {
        if (!agreeToTerms) {
            toast.error("Please agree to the Terms & Conditions and Privacy Policy")
            return
        }
        if (!name.trim()) {
            toast.error("Please enter your name")
            return
        }
        if (!email.trim()) {
            toast.error("Please enter your email")
            return
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        setLoading(true)

        let firebaseUserCreated = false

        try {
            // 1. Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            firebaseUserCreated = true // Mark that Firebase user was successfully created

            // 2. Send verification email
            await sendEmailVerification(user)

            // 3. Get ID token
            const idToken = await user.getIdToken()

            // 4. ATTEMPT to sync with backend (create MongoDB user)
            // This is non-blocking - if it fails, we still show verification page
            try {
                await axios.post(
                    serverUrl + "/api/auth/firebase-sync",
                    { name, email, role },
                    { headers: { Authorization: `Bearer ${idToken}` } }
                )
            } catch (syncError) {
                console.error("Backend sync failed (non-critical):", syncError)
                // Don't show error to user - they can complete sync on login
            }

            // 5. Sign out until they verify
            await signOut(auth)

            // 6. ALWAYS redirect to verification page if we got this far
            navigate('/verify-email-sent')

        } catch (error) {
            console.error("SignUp Error:", error)

            // If Firebase user was created but we hit an error later, still redirect
            if (firebaseUserCreated) {
                navigate('/verify-email-sent')
                return
            }

            // Otherwise, handle Firebase creation errors
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email already registered. Please login.")
                setTimeout(() => setMode("login"), 2000) // Auto-switch to login
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password is too weak.")
            } else {
                toast.error(error.message || "Sign up failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (mode === "login") {
            handleLogin()
        } else {
            handleSignUp()
        }
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form className='w-[90%] md:w-200 h-auto min-h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={handleSubmit}>
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 py-6'>

                    {/* Toggle Tabs */}
                    <div className='flex w-[80%] bg-gray-100 rounded-lg p-1 mb-2'>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === 'login' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                            onClick={() => setMode('login')}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${mode === 'signup' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                            onClick={() => setMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Header */}
                    <div>
                        <h1 className='font-semibold text-[black] text-2xl text-center'>
                            {mode === 'login' ? 'Welcome back' : "Let's get Started"}
                        </h1>
                        <h2 className='text-[#999797] text-[18px] text-center'>
                            {mode === 'login' ? 'Login to your account' : 'Create your account'}
                        </h2>
                    </div>

                    {/* Name field (Sign Up only) */}
                    {mode === 'signup' && (
                        <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                            <label htmlFor="name" className='font-semibold'>Name</label>
                            <input
                                id='name'
                                type="text"
                                className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                                placeholder='Your name'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>
                    )}

                    {/* Email field */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input
                            id='email'
                            type="email"
                            className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                            placeholder='Your email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Password field */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input
                            id='password'
                            type={show ? "text" : "password"}
                            className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-black'
                            placeholder='***********'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        {!show && <VisibilityOffOutlinedIcon className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                        {show && <VisibilityOutlinedIcon className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                    </div>



                    {/* Terms & Conditions (Both Login and Sign Up) */}
                    <div className='flex items-start gap-2 w-[80%] px-3'>
                        <input
                            type="checkbox"
                            id="agreeTerms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className='mt-1 w-4 h-4 cursor-pointer accent-black'
                        />
                        <label htmlFor="agreeTerms" className='text-[13px] text-[#6f6f6f]'>
                            I agree to the{' '}
                            <Link to="/terms" className='text-black underline hover:text-blue-600'>
                                Terms & Conditions
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className='text-black underline hover:text-blue-600'>
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] transition-none disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading || !agreeToTerms}
                    >
                        {loading ? <ClipLoader size={30} color='white' /> : (mode === 'login' ? "Login" : "Sign Up")}
                    </button>

                    {/* Divider */}
                    <div className='flex items-center w-[80%] gap-2'>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                        <span className='text-[#6f6f6f] text-[13px]'>or</span>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                    </div>

                    {/* Google button */}
                    <button
                        type="button"
                        className='w-[80%] h-[40px] bg-white border border-[#d1d1d1] text-black cursor-pointer flex items-center justify-center gap-2 rounded-[5px] transition-none disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={googleLoading || !agreeToTerms}
                        onClick={handleGoogleAuth}
                    >
                        {googleLoading ? <ClipLoader size={25} color='black' /> : <><GoogleIcon sx={{ fontSize: 22, color: '#4285F4' }} /> Continue with Google</>}
                    </button>

                    {/* Forgot password (Login only) */}
                    {mode === 'login' && (
                        <span
                            className='text-[13px] cursor-pointer text-[#585757] hover:underline'
                            onClick={() => navigate("/forgotpassword")}
                        >
                            Forgot your password?
                        </span>
                    )}



                </div>

                {/* Right side - Logo */}
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} className='w-30 shadow-2xl' alt="" />
                    <span className='text-[white] text-2xl text-center px-4'>JAGAT ACADEMY INTEGRATED E-LEARNING PLATFORM</span>
                </div>
            </form>
        </div>
    )
}

export default Auth
