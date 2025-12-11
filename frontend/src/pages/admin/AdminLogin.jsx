import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            }
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500 rounded-full blur-3xl"></div>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-black rounded-2xl flex items-center justify-center shadow-xl border border-white/10">
                            <FaShieldAlt className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-gray-400">Sign in to access the dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <ClipLoader size={24} color="black" />
                            ) : (
                                <>
                                    <FaLock className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Protected admin area. Unauthorized access prohibited.
                        </p>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
