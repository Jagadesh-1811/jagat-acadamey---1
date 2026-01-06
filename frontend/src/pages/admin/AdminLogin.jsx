import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import SecurityIcon from '@mui/icons-material/Security';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { serverUrl } from '../../App';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${serverUrl}/api/admin/login`, {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminData', JSON.stringify(response.data.admin));
                toast.success('Login successful!');
                navigate('/admin/dashboard');
            } else {
                toast.error('Login failed. No token received.');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            toast.error(error.response?.data?.message || 'Invalid credentials. Please check your email and password.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-[0.02]">
                    <div
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white rounded-full blur-3xl"
                        style={{ animation: 'pulse 4s ease-in-out infinite' }}
                    />
                    <div
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white rounded-full blur-3xl"
                        style={{ animation: 'pulse 4s ease-in-out infinite 1s' }}
                    />
                </div>
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div
                className="relative w-full max-w-md"
                style={{ animation: 'adminFadeIn 0.6s ease-out' }}
            >
                {/* Main Card */}
                <div
                    className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div
                            className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-110 hover:rotate-3"
                            style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
                        >
                            <SecurityIcon sx={{ fontSize: 48, color: 'white' }} />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-black mb-3 tracking-tight">Admin Portal</h1>
                        <p className="text-gray-500">Sign in to access the dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focused === 'email' ? 'text-black' : 'text-gray-400'}`}>
                                    <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused('')}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    placeholder="admin@example.com"
                                />
                                <div className={`absolute bottom-0 left-1/2 h-0.5 bg-black transition-all duration-300 ${focused === 'email' ? 'w-[calc(100%-2rem)] -translate-x-1/2' : 'w-0 -translate-x-1/2'}`} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focused === 'password' ? 'text-black' : 'text-gray-400'}`}>
                                    <LockOutlinedIcon sx={{ fontSize: 20 }} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused('')}
                                    className="w-full pl-12 pr-14 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-all duration-200 hover:scale-110"
                                >
                                    {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />}
                                </button>
                                <div className={`absolute bottom-0 left-1/2 h-0.5 bg-black transition-all duration-300 ${focused === 'password' ? 'w-[calc(100%-2rem)] -translate-x-1/2' : 'w-0 -translate-x-1/2'}`} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
                        >
                            {loading ? (
                                <ClipLoader size={24} color="white" />
                            ) : (
                                <>
                                    <LockOutlinedIcon sx={{ fontSize: 16 }} className="transition-transform group-hover:scale-110" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>Secure admin access</span>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-sm group"
                    >
                        <ArrowBackIcon sx={{ fontSize: 16 }} className="transition-transform group-hover:-translate-x-1" />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>

            {/* Add keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.02; }
                    50% { transform: scale(1.1); opacity: 0.05; }
                }
                @keyframes adminFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
