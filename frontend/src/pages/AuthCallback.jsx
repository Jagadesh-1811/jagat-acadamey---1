import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'

import { serverUrl } from '../App'
import { setUserData, setToken } from '../redux/userSlice'

function AuthCallback() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('Verifying your email...')
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the session from Supabase (handles the email verification automatically)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    throw sessionError
                }

                if (!session) {
                    // Check if this is an email confirmation
                    const hashParams = new URLSearchParams(window.location.hash.substring(1))
                    const accessToken = hashParams.get('access_token')
                    const type = hashParams.get('type')

                    if (type === 'signup' || type === 'email') {
                        setStatus('Email verified! Setting up your account...')

                        // Set the session with the tokens from URL
                        const { data: { session: newSession }, error: setSessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: hashParams.get('refresh_token')
                        })

                        if (setSessionError) {
                            throw setSessionError
                        }

                        if (newSession) {
                            await syncUserWithBackend(newSession)
                            return
                        }
                    }

                    setError('No valid session found. Please try logging in again.')
                    setTimeout(() => navigate('/login'), 3000)
                    return
                }

                await syncUserWithBackend(session)

            } catch (err) {
                console.error('Auth callback error:', err)
                setError(err.message || 'An error occurred during verification')
                setTimeout(() => navigate('/login'), 3000)
            }
        }

        const syncUserWithBackend = async (session) => {
            try {
                setStatus('Syncing your account...')

                // Get stored signup data (name, role)
                const signupData = JSON.parse(localStorage.getItem('pendingSignupData') || '{}')

                // Sync with backend
                const response = await axios.post(`${serverUrl}/api/auth/supabase-sync`, {
                    email: session.user.email,
                    supabaseId: session.user.id,
                    name: signupData.name || session.user.email.split('@')[0],
                    role: signupData.role || 'student'
                })

                // Clear pending signup data
                localStorage.removeItem('pendingSignupData')

                // Update Redux store
                dispatch(setUserData(response.data.user))
                dispatch(setToken(response.data.token))

                toast.success('Email verified successfully! Welcome to Jagat Academy!')
                navigate('/')

            } catch (err) {
                console.error('Backend sync error:', err)
                setError(err.response?.data?.message || 'Failed to sync account with server')
                setTimeout(() => navigate('/login'), 3000)
            }
        }

        handleAuthCallback()
    }, [navigate, dispatch])

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-4'>
            <div className='bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-md'>
                {!error ? (
                    <>
                        <ClipLoader size={50} color='black' />
                        <h2 className='text-xl font-semibold text-black'>{status}</h2>
                        <p className='text-gray-500 text-center'>Please wait while we complete the verification process.</p>
                    </>
                ) : (
                    <>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                            <span className='text-black text-2xl'><CloseIcon /></span>
                        </div>
                        <h2 className='text-xl font-semibold text-red-600'>Verification Failed</h2>
                        <p className='text-gray-500 text-center'>{error}</p>
                        <p className='text-sm text-gray-400'>Redirecting to login...</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthCallback
