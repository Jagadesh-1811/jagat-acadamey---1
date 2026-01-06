import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMarkEmailRead } from "react-icons/md";
import { FaEnvelopeOpenText, FaInfoCircle, FaExclamationTriangle, FaCheck, FaChalkboardTeacher } from "react-icons/fa";

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [isEducatorSignup, setIsEducatorSignup] = useState(false);

    useEffect(() => {
        // Check if this is an educator signup
        const educatorFlag = localStorage.getItem('pendingEducatorSignup');
        if (educatorFlag === 'true') {
            setIsEducatorSignup(true);
        }
    }, []);

    const handleLogin = () => {
        // Clear the educator flag when they click login
        localStorage.removeItem('pendingEducatorSignup');
        if (isEducatorSignup) {
            navigate('/educator/login');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center border-2 border-gray-300">
                <div className="bg-black p-6 rounded-full mb-6 animate-pulse">
                    <MdMarkEmailRead className="text-7xl text-white" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2 sm:gap-4 justify-center">
                    <FaEnvelopeOpenText /> Check Your Email!
                </h1>

                <p className="text-gray-700 mb-4 text-lg font-medium">
                    We've sent a <span className="text-black font-bold">verification link</span> to your email address.
                </p>

                <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-5 mb-6 w-full text-left">
                    <p className="font-bold text-gray-900 mb-2 flex items-center gap-2"><FaInfoCircle /> Important Instructions:</p>
                    <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
                        <li>Open your <strong>Gmail inbox</strong> (check Spam folder too!)</li>
                        <li>Find the email from <strong>Jagat Academy</strong></li>
                        <li><strong>Click the verification link</strong> in the email</li>
                        <li>Then <strong>return here and Login</strong></li>
                    </ol>
                </div>

                <div className="bg-white border-l-4 border-black p-4 mb-6 text-left w-full text-sm text-gray-800 shadow-md">
                    <p className="font-bold mb-1 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-500" /> Note:</p>
                    <p>You <strong>MUST verify your email first</strong> before you can login and access the platform.</p>
                </div>

                {/* Login Button - Shows appropriate text based on signup type */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition duration-200 shadow-lg"
                >
                    <span className="flex items-center justify-center gap-2">
                        {isEducatorSignup ? (
                            <><FaChalkboardTeacher /> I've Verified - Educator Login</>
                        ) : (
                            <><FaCheck /> I've Verified - Click to Login</>
                        )}
                    </span>
                </button>

                {/* Educator approval notice - only show for educators */}
                {isEducatorSignup && (
                    <p className="text-sm text-gray-500 mt-4">
                        After verifying, you'll need admin approval before accessing educator features.
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
