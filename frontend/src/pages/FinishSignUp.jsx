import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData, setToken } from '../redux/userSlice';
import { auth, isSignInWithEmailLink, signInWithEmailLink } from '../../utils/Firebase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import logo from '../assets/logo.jpg';

function FinishSignUp() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [manualEmail, setManualEmail] = useState('');
    const [needsEmail, setNeedsEmail] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const completeSignIn = async (email) => {
        try {
            // Get the role from localStorage (set during email link request)
            const role = window.localStorage.getItem('roleForSignIn') || 'student';

            // Complete sign-in with Firebase
            const result = await signInWithEmailLink(auth, email, window.location.href);

            // Clear localStorage
            window.localStorage.removeItem('emailForSignIn');
            window.localStorage.removeItem('roleForSignIn');

            // Register/login user in our backend
            const response = await axios.post(serverUrl + "/api/auth/email-link-signup", {
                name: email.split('@')[0], // Use email prefix as initial name
                email: email,
                role: role
            });

            // Store user data and token
            dispatch(setUserData(response.data.user));
            dispatch(setToken(response.data.token));

            setSuccess(true);
            toast.success("Welcome! You're now signed in.");

            // Redirect to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error("Sign-in completion error:", error);

            let errorMessage = "Failed to complete sign-in. Please try again.";

            if (error.code === 'auth/invalid-action-code') {
                errorMessage = "This link has expired or already been used. Please request a new link.";
            } else if (error.code === 'auth/expired-action-code') {
                errorMessage = "This link has expired. Please request a new link.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address. Please check and try again.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setError(errorMessage);
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleEmailLink = async () => {
            // Check if this is a valid sign-in link
            if (!isSignInWithEmailLink(auth, window.location.href)) {
                setError("Invalid sign-in link. Please request a new verification email.");
                setLoading(false);
                return;
            }

            // Try to get email from localStorage (same device)
            let email = window.localStorage.getItem('emailForSignIn');

            if (!email) {
                // User opened link on different device - need to ask for email
                setNeedsEmail(true);
                setLoading(false);
                return;
            }

            // Complete the sign-in
            await completeSignIn(email);
        };

        handleEmailLink();
    }, []);

    const handleManualEmailSubmit = async () => {
        if (!manualEmail) {
            toast.error("Please enter your email address");
            return;
        }
        setLoading(true);
        setNeedsEmail(false);
        await completeSignIn(manualEmail);
    };

    // Loading state
    if (loading) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-4'>
                <div className='bg-white shadow-xl rounded-2xl p-12 text-center'>
                    <ClipLoader size={50} color='#000' />
                    <p className='mt-6 text-gray-600 text-lg'>Verifying your email...</p>
                    <p className='text-gray-400 text-sm mt-2'>Please wait a moment</p>
                </div>
            </div>
        );
    }

    // Need email input (different device)
    if (needsEmail) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
                <div className='w-[90%] md:w-[450px] bg-white shadow-xl rounded-2xl p-8'>
                    <div className='text-center mb-6'>
                        <img src={logo} className='w-20 mx-auto mb-4' alt="Logo" />
                        <h1 className='text-2xl font-bold text-black'>Confirm Your Email</h1>
                        <p className='text-gray-500 mt-2'>
                            You opened this link on a different device. Please enter your email to continue.
                        </p>
                    </div>

                    <div className='space-y-4'>
                        <div>
                            <label className='block font-semibold mb-2'>Email Address</label>
                            <input
                                type="email"
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                className='w-full h-[45px] border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-black'
                                placeholder='Enter the email you used to sign up'
                            />
                        </div>

                        <button
                            onClick={handleManualEmailSubmit}
                            className='w-full h-[50px] bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold'
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
                <div className='w-[90%] md:w-[450px] bg-white shadow-xl rounded-2xl p-8 text-center'>
                    <WarningIcon className='text-6xl text-red-500 mx-auto mb-6' />
                    <h1 className='text-2xl font-bold text-black mb-4'>Verification Failed</h1>
                    <p className='text-gray-600 mb-6'>{error}</p>
                    <div className='space-y-3'>
                        <button
                            onClick={() => navigate('/email-signin')}
                            className='w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'
                        >
                            Request New Link
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className='w-full py-3 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors'
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
                <div className='w-[90%] md:w-[450px] bg-white shadow-xl rounded-2xl p-8 text-center'>
                    <CheckCircleIcon className='text-6xl text-green-500 mx-auto mb-6' />
                    <h1 className='text-2xl font-bold text-black mb-4'>Welcome to Jagat Academy!</h1>
                    <p className='text-gray-600 mb-4'>Your email has been verified successfully.</p>
                    <p className='text-gray-400'>Redirecting you to the homepage...</p>
                    <div className='mt-6'>
                        <ClipLoader size={30} color='#000' />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default FinishSignUp;
