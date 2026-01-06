import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaCommentAlt, FaBug, FaPaperPlane, FaLightbulb } from 'react-icons/fa';

const Feedback = () => {
    const [formType, setFormType] = useState('feedback'); // 'feedback' or 'issue'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/api/feedback/submit`, {
                type: formType,
                ...formData
            });
            toast.success(response.data.message);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen bg-white">
            <Nav />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        We'd Love to Hear From You
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Share your feedback or report any issues you've encountered. Your input helps us improve Jagat Academy.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                    {/* Toggle Buttons */}
                    <div className="flex justify-center mb-10">
                        <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
                            <button
                                onClick={() => setFormType('feedback')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${formType === 'feedback'
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:text-black'
                                    }`}
                            >
                                <FaCommentAlt className="w-4 h-4" />
                                Feedback
                            </button>
                            <button
                                onClick={() => setFormType('issue')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${formType === 'issue'
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:text-black'
                                    }`}
                            >
                                <FaBug className="w-4 h-4" />
                                Report Issue
                            </button>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-black mb-2">
                                {formType === 'feedback' ? 'Share Your Feedback' : 'Report an Issue'}
                            </h2>
                            <p className="text-gray-500">
                                {formType === 'feedback'
                                    ? 'Let us know what you think about our platform, courses, or features.'
                                    : 'Found a bug or experiencing problems? Describe the issue in detail.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name & Email Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder={formType === 'feedback' ? 'What is your feedback about?' : 'Brief description of the issue'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {formType === 'feedback' ? 'Your Feedback' : 'Issue Details'}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder={formType === 'feedback'
                                        ? 'Share your thoughts, suggestions, or experience...'
                                        : 'Please describe the issue in detail. Include steps to reproduce if possible.'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-lg font-medium transition-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <ClipLoader size={24} color="white" />
                                ) : (
                                    <>
                                        <FaPaperPlane className="w-4 h-4" />
                                        {formType === 'feedback' ? 'Submit Feedback' : 'Submit Issue Report'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <FaCommentAlt className="w-6 h-6 text-gray-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">Feedback</h3>
                            <p className="text-gray-500 text-sm">
                                Share your experience, suggestions for improvements, or praise for features you love.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <FaBug className="w-6 h-6 text-gray-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">Report Issues</h3>
                            <p className="text-gray-500 text-sm">
                                Found a bug or technical problem? Let us know so we can fix it quickly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Feedback;
