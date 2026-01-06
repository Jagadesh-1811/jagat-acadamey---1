import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData, setToken } from '../redux/userSlice'
import { ClipLoader } from 'react-spinners'
import { FaCheck, FaTimes } from 'react-icons/fa';

function VerifyEmail() {
    const { token } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('verifying') // verifying, success, error
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${serverUrl}/api/auth/verify-email/${token}`)

                if (response.data.user && response.data.token) {
                    // Auto login the user
                    dispatch(setUserData(response.data.user))
                    dispatch(setToken(response.data.token))
                    setStatus('success')
                    setMessage('Email verified successfully!')
                    toast.success('Email verified! Welcome to Jagat Academy!')

                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                }
            } catch (error) {
                console.error('Verification error:', error)
                setStatus('error')
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.')
                toast.error('Verification failed')
            }
        }

        if (token) {
            verifyEmail()
        }
    }, [token, navigate, dispatch])

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <div className='w-[90%] md:w-[500px] bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-6'>
                {status === 'verifying' && (
                    <>
                        <ClipLoader size={60} color='black' />
                        <h1 className='font-semibold text-black text-2xl text-center'>Verifying Your Email...</h1>
                        <p className='text-gray-500 text-center'>Please wait while we verify your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='w-20 h-20 bg-black rounded-full flex items-center justify-center'>
                            <span className='text-white text-3xl'><FaCheck /></span>
                        </div>
                        <h1 className='font-semibold text-black text-2xl text-center'>Email Verified!</h1>
                        <p className='text-gray-600 text-center'>
                            Your email has been verified successfully. Welcome to <strong>Jagat Academy</strong>!
                        </p>
                        <p className='text-gray-500 text-sm text-center'>
                            Redirecting you to the homepage...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center'>
                            <span className='text-black text-3xl'><FaTimes /></span>
                        </div>
                        <h1 className='font-semibold text-black text-2xl text-center'>Verification Failed</h1>
                        <p className='text-gray-600 text-center'>{message}</p>
                        <div className='flex gap-4 mt-4'>
                            <button
                                onClick={() => navigate('/signup')}
                                className='px-6 py-2 bg-black text-white rounded-lg transition-none'
                            >
                                Sign Up Again
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className='px-6 py-2 bg-black text-white rounded-lg transition-none'
                            >
                                Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail
