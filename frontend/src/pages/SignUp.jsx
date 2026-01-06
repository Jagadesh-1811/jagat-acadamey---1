import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { MdRemoveRedEye } from "react-icons/md";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData, setToken } from '../redux/userSlice'
import { auth, googleProvider } from '../../utils/Firebase'
import { signInWithPopup } from 'firebase/auth'


function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const navigate = useNavigate()
    let [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    let dispatch = useDispatch()

    const handleGoogleSignUp = async () => {
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
            toast.success("Sign Up Successfully with Google")
        } catch (error) {
            console.error("Google SignUp Error:", error)
            if (error.code === 'auth/admin-restricted-operation') {
                toast.error("Google Sign-In is not enabled. Please enable it in Firebase Console.")
            } else if (error.code === 'auth/popup-blocked') {
                toast.error("Popup was blocked. Please allow popups for this site.")
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Sign-up cancelled. Please try again.")
            } else if (error.code) {
                toast.error(`Firebase Error: ${error.code}`)
            } else {
                toast.error(error.response?.data?.message || "Google sign up failed. Please try again.")
            }
        }
        setGoogleLoading(false)
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
        try {
            // Sign up with Supabase (sends verification email automatically)
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        name: name,
                        role: role
                    }
                }
            })

            if (error) {
                throw error
            }

            // Store signup data temporarily for the callback
            localStorage.setItem('pendingSignupData', JSON.stringify({
                name: name,
                role: role
            }))

            setEmailSent(true)
            toast.success("Please check your email to verify your account!")

        } catch (error) {
            console.error("SignUp Error:", error)
            if (error.message?.includes('already registered')) {
                toast.error("This email is already registered. Please login instead.")
            } else {
                toast.error(error.message || "Sign up failed. Please try again.")
            }
        }
        setLoading(false)
    }

    // Email verification sent screen
    if (emailSent) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
                <div className='w-[90%] md:w-[500px] bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-6'>
                    <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center'>
                        <span className='text-black text-4xl'><FaEnvelopeOpenText /></span>
                    </div>
                    <h1 className='font-semibold text-black text-2xl text-center'>Check Your Email</h1>
                    <p className='text-gray-600 text-center'>
                        We've sent a verification link to <strong>{email}</strong>
                    </p>
                    <p className='text-gray-500 text-sm text-center'>
                        Click the link in the email to verify your account and complete registration.
                    </p>
                    <div className='w-full border-t border-gray-200 pt-4 mt-2'>
                        <p className='text-sm text-gray-500 text-center'>
                            Didn't receive the email?{' '}
                            <button
                                onClick={async () => {
                                    try {
                                        const { error } = await supabase.auth.resend({
                                            type: 'signup',
                                            email: email
                                        })
                                        if (error) throw error
                                        toast.success("Verification email resent!")
                                    } catch (err) {
                                        toast.error(err.message || "Failed to resend email")
                                    }
                                }}
                                className='text-blue-600 hover:underline font-medium'
                            >
                                Resend
                            </button>
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEmailSent(false)
                            setEmail("")
                            setPassword("")
                        }}
                        className='text-gray-500 text-sm hover:underline'
                    >
                        Use a different email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form className='w-[90%] md:w-200 h-auto min-h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e) => e.preventDefault()}>
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 py-6'>
                    <div><h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
                        <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
                    </div>
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="name" className='font-semibold'>
                            Name
                        </label>
                        <input id='name' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>
                            Email
                        </label>
                        <input id='email' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='Your email' onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>
                            Password
                        </label>
                        <input id='password' type={show ? "text" : "password"} className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='***********' onChange={(e) => setPassword(e.target.value)} value={password} />
                        {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                        {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                    </div>
                    <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                        <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${role === 'student' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("student")}>Student</span>
                        <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${role === 'educator' ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("educator")}>Educator</span>
                    </div>

                    {/* Terms & Conditions Checkbox */}
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

                    <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading || !agreeToTerms} onClick={handleSignUp}>{loading ? <ClipLoader size={30} color='white' /> : "Sign Up"}</button>

                    <div className='flex items-center w-[80%] gap-2'>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                        <span className='text-[#6f6f6f] text-[13px]'>or</span>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                    </div>

                    <button className='w-[80%] h-[40px] bg-white border border-[#d1d1d1] text-black cursor-pointer flex items-center justify-center gap-2 rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition-none' disabled={googleLoading || !agreeToTerms} onClick={handleGoogleSignUp}>
                        {googleLoading ? <ClipLoader size={25} color='black' /> : <><FcGoogle className='text-xl' /> Continue with Google</>}
                    </button>

                    <div className='text-[#6f6f6f]'>Already have an account? <span className='underline underline-offset-1 text-[black] cursor-pointer' onClick={() => navigate("/login")}>Login</span></div>


                </div>
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'><img src={logo} className='w-30 shadow-2xl' alt="" />
                    <span className='text-[white] text-2xl'>JAGAT ACADEMY</span>
                </div>

            </form>

        </div>
    )
}

export default SignUp
