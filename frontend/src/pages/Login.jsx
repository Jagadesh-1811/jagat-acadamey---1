import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData, setToken } from '../redux/userSlice'
import { auth, googleProvider } from '../../utils/Firebase'
import { signInWithPopup } from 'firebase/auth'


function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    let [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    let dispatch = useDispatch()

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user
            const response = await axios.post(serverUrl + "/api/auth/googlesignup", {
                name: user.displayName,
                email: user.email,
                role: "user"
            })
            dispatch(setUserData(response.data.user))
            dispatch(setToken(response.data.token))
            navigate("/")
            toast.success("Login Successfully with Google")
        } catch (error) {
            console.error("Google Login Error:", error)
            if (error.code === 'auth/admin-restricted-operation') {
                toast.error("Google Sign-In is not enabled. Please enable it in Firebase Console.")
            } else if (error.code === 'auth/popup-blocked') {
                toast.error("Popup was blocked. Please allow popups for this site.")
            } else if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Sign-in cancelled. Please try again.")
            } else if (error.code) {
                toast.error(`Firebase Error: ${error.code}`)
            } else {
                toast.error(error.response?.data?.message || "Google login failed. Please try again.")
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
            // First, sign in with Supabase
            const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })

            if (supabaseError) {
                // Check if email is not confirmed
                if (supabaseError.message?.includes('Email not confirmed')) {
                    toast.error("Please verify your email before logging in. Check your inbox for the verification link.")
                    setLoading(false)
                    return
                }
                throw supabaseError
            }

            // Supabase login successful, now sync with backend
            const response = await axios.post(serverUrl + "/api/auth/supabase-login", {
                email: email,
                supabaseId: supabaseData.user.id
            })

            dispatch(setUserData(response.data.user))
            dispatch(setToken(response.data.token))
            navigate("/")
            toast.success("Login Successfully")

        } catch (error) {
            console.error("Login Error:", error)

            if (error.message === 'Invalid login credentials') {
                toast.error("Invalid email or password. Please try again.")
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else if (error.message) {
                toast.error(error.message)
            } else {
                toast.error("Network error or server is down.")
            }
        }
        setLoading(false)
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e) => e.preventDefault()}>
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-4 '>
                    <div><h1 className='font-semibold text-[black] text-2xl'>Welcome back</h1>
                        <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
                    </div>
                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>
                            Email
                        </label>
                        <input id='email' type="text" className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-black' placeholder='Your email' onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3 relative'>
                        <label htmlFor="password" className='font-semibold'>
                            Password
                        </label>
                        <input id='password' type={show ? "text" : "password"} className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] rounded-md focus:outline-none focus:ring-1 focus:ring-black' placeholder='***********' onChange={(e) => setPassword(e.target.value)} value={password} />
                        {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                        {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={() => setShow(prev => !prev)} />}
                    </div>

                    <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] transition-none' disabled={loading} onClick={handleLogin}>{loading ? <ClipLoader size={30} color='white' /> : "Login"}</button>

                    <div className='flex items-center w-[80%] gap-2'>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                        <span className='text-[#6f6f6f] text-[13px]'>or</span>
                        <div className='flex-1 h-[1px] bg-[#d1d1d1]'></div>
                    </div>

                    <button className='w-[80%] h-[40px] bg-white border border-[#d1d1d1] text-black cursor-pointer flex items-center justify-center gap-2 rounded-[5px] transition-none' disabled={googleLoading} onClick={handleGoogleLogin}>
                        {googleLoading ? <ClipLoader size={25} color='black' /> : <><FcGoogle className='text-xl' /> Continue with Google</>}
                    </button>

                    <span className='text-[13px] cursor-pointer text-[#585757] hover:underline' onClick={() => navigate("/forgotpassword")}>Forget your password?</span>

                    <div className='text-[#6f6f6f]'>Don't have an account? <span className='underline underline-offset-1 text-[black] hover:text-gray-700' onClick={() => navigate("/signup")}>Sign up</span></div>

                </div>
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'><img src={logo} className='w-30 shadow-2xl' alt="" />
                    <span className='text-[white] text-2xl text-center px-4'>JAGAT ACADEMY INTEGRATED E-LEARNING PLATFORM</span>
                </div>
            </form>

        </div>
    )
}

export default Login
