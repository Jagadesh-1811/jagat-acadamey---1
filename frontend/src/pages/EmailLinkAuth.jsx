import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { HiMail } from 'react-icons/hi';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { auth, sendSignInLinkToEmail, getActionCodeSettings } from '../../utils/Firebase';

function EmailLinkAuth() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSendEmailLink = async () => {
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            // Get the current URL base
            const baseUrl = window.location.origin;
            const actionCodeSettings = getActionCodeSettings(baseUrl);

            // Send the sign-in link to email
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);

            // Save email and role to localStorage for completing sign-in on same device
            window.localStorage.setItem('emailForSignIn', email);
            window.localStorage.setItem('roleForSignIn', role);

            setEmailSent(true);
            toast.success("Verification link sent to your email!");
        } catch (error) {
            console.error("Email Link Error:", error);

            if (error.code === 'auth/invalid-email') {
                toast.error("Invalid email address format");
            } else if (error.code === 'auth/missing-continue-uri') {
                toast.error("Configuration error. Please contact support.");
            } else if (error.code === 'auth/operation-not-allowed') {
                toast.error("Email link sign-in is not enabled. Please enable it in Firebase Console.");
            } else if (error.code === 'auth/unauthorized-continue-uri') {
                toast.error("This domain is not authorized. Please add it to Firebase Console.");
            } else {
                toast.error(error.message || "Failed to send verification email. Please try again.");
            }
        }
        setLoading(false);
    };

    // Success screen after email is sent
    if (emailSent) {
        return (
            <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
                <div className='w-[90%] md:w-[500px] bg-white shadow-xl rounded-2xl p-8 text-center'>
                    <FaCheckCircle className='text-6xl text-green-500 mx-auto mb-6' />
                    <h1 className='text-2xl font-bold text-black mb-4'>Check Your Email!</h1>
                    <p className='text-gray-600 mb-2'>
                        We've sent a verification link to:
                    </p>
                    <p className='text-black font-semibold text-lg mb-6'>{email}</p>
                    <div className='bg-gray-100 rounded-xl p-4 mb-6 text-left'>
                        <p className='text-sm text-gray-600 mb-2'>
                            <strong>Next steps:</strong>
                        </p>
                        <ul className='text-sm text-gray-600 space-y-1'>
                            <li>1. Open your email inbox</li>
                            <li>2. Click the verification link</li>
                            <li>3. You'll be automatically signed in</li>
                        </ul>
                    </div>
                    <p className='text-sm text-gray-500 mb-6'>
                        Didn't receive the email? Check your spam folder or{' '}
                        <span
                            className='text-blue-600 cursor-pointer hover:underline'
                            onClick={() => setEmailSent(false)}
                        >
                            try again
                        </span>
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className='w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form className='w-[90%] md:w-200 h-auto min-h-150 bg-white shadow-xl rounded-2xl flex' onSubmit={(e) => e.preventDefault()}>
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-4 py-8'>

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className='self-start ml-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors'
                    >
                        <FaArrowLeft /> Back
                    </button>

                    {/* Header */}
                    <div className='text-center'>
                        <div className='flex items-center justify-center gap-2 mb-2'>
                            <HiMail className='text-3xl text-blue-500' />
                        </div>
                        <h1 className='font-semibold text-black text-2xl'>Sign in with Email Link</h1>
                        <h2 className='text-gray-500 text-[16px] mt-2'>No password needed - we'll send you a link</h2>
                    </div>

                    {/* Email Input */}
                    <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                        <label htmlFor="email" className='font-semibold'>
                            Email Address
                        </label>
                        <input
                            id='email'
                            type="email"
                            className='border w-[100%] h-[45px] border-gray-300 text-[15px] px-[20px] rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
                            placeholder='Enter your email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Role Selection */}
                    <div className='flex flex-col gap-2 w-[80%] px-3'>
                        <label className='font-semibold'>I am a</label>
                        <div className='flex gap-4'>
                            <span
                                className={`flex-1 text-center py-3 border rounded-xl cursor-pointer transition-all ${role === 'student'
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                                onClick={() => setRole("student")}
                            >
                                Student
                            </span>
                            <span
                                className={`flex-1 text-center py-3 border rounded-xl cursor-pointer transition-all ${role === 'educator'
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 hover:border-gray-400"
                                    }`}
                                onClick={() => setRole("educator")}
                            >
                                Educator
                            </span>
                        </div>
                    </div>

                    {/* Send Link Button */}
                    <button
                        className='w-[80%] h-[50px] bg-blue-600 text-white cursor-pointer flex items-center justify-center gap-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading || !email}
                        onClick={handleSendEmailLink}
                    >
                        {loading ? <ClipLoader size={25} color='white' /> : <>
                            <HiMail className='text-xl' />
                            Send Verification Link
                        </>}
                    </button>

                    {/* Info Text */}
                    <div className='w-[80%] px-3'>
                        <p className='text-sm text-gray-500 text-center'>
                            We'll send a magic link to your email. Click it to sign in instantly - no password required!
                        </p>
                    </div>

                    {/* Divider */}
                    <div className='flex items-center w-[80%] gap-2 my-2'>
                        <div className='flex-1 h-[1px] bg-gray-300'></div>
                        <span className='text-gray-500 text-[13px]'>or</span>
                        <div className='flex-1 h-[1px] bg-gray-300'></div>
                    </div>

                    {/* Alternative Options */}
                    <div className='text-gray-600'>
                        <span
                            className='text-black underline cursor-pointer hover:text-gray-700'
                            onClick={() => navigate("/signup")}
                        >
                            Sign up with password
                        </span>
                        {' · '}
                        <span
                            className='text-black underline cursor-pointer hover:text-gray-700'
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </div>

                </div>

                {/* Right Side - Logo */}
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} className='w-30 shadow-2xl' alt="Jagat Academy Logo" />
                    <span className='text-white text-2xl mt-4'>JAGAT ACADEMY</span>
                </div>

            </form>
        </div>
    );
}

export default EmailLinkAuth;
