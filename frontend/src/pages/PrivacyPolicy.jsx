import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { FaArrowLeft, FaDatabase, FaLock, FaUserShield, FaEye, FaTrash, FaCookie, FaGlobe, FaEnvelope, FaBell, FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const keyPoints = [
        {
            icon: <FaDatabase className="text-blue-500" />,
            title: "Information We Collect",
            content: "We collect your name, email, profile photo, learning progress, assignment submissions, quiz scores, and certificates earned."
        },
        {
            icon: <FaEye className="text-purple-500" />,
            title: "How We Use Your Data",
            content: "Your data powers your learning experience: account management, course delivery, progress tracking, AI assistance, and certificate generation."
        },
        {
            icon: <FaUserShield className="text-green-500" />,
            title: "Data Sharing",
            content: "We share data with: Firebase (login), Cloudinary (images), Razorpay (payments), ZegoCloud (voice), and Google AI (chatbot). We never sell your data."
        },
        {
            icon: <FaLock className="text-red-500" />,
            title: "Security Measures",
            content: "Passwords are encrypted with bcrypt. All data is transmitted via HTTPS/SSL. We use JWT tokens for secure authentication."
        },
        {
            icon: <FaShieldAlt className="text-blue-500" />,
            title: "Your Rights",
            content: "You can access, update, or delete your personal data. Request a copy of your data anytime. Opt-out of marketing emails."
        },
        {
            icon: <FaTrash className="text-orange-500" />,
            title: "Data Retention",
            content: "Account data is kept until you delete it. Certificates are stored indefinitely. Payment records are kept for 7 years (legal requirement)."
        },
        {
            icon: <FaCookie className="text-yellow-600" />,
            title: "Cookies",
            content: "We use essential cookies for login sessions and security. Analytics cookies help us improve the platform. You can manage cookies in your browser."
        },
        {
            icon: <FaGlobe className="text-teal-500" />,
            title: "International Data",
            content: "Data is stored on MongoDB Atlas servers. For EU users: we comply with GDPR. Data transfers follow appropriate safeguards."
        },
        {
            icon: <FaBell className="text-pink-500" />,
            title: "Updates & Notifications",
            content: "We may update this policy. Significant changes will be notified via email. Continued use means you accept the updates."
        },
        {
            icon: <FaEnvelope className="text-indigo-500" />,
            title: "Contact Us",
            content: "For any questions, contact us at: official.jagat.services@gmail.com. We respond within 48 hours."
        }
    ];

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-50 pt-20 pb-16">
                {/* Header */}
                <div className="bg-black text-white py-12">
                    <div className="max-w-4xl mx-auto px-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <FaArrowLeft /> Back
                        </button>
                        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-gray-400">
                            Last Updated: December 13, 2024
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Matters</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At Jagat Academy, we are committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your data
                            when you use our platform. We believe in transparency and your right to control your data.
                        </p>
                    </div>

                    {/* Key Points Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {keyPoints.map((point, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xl">{point.icon}</span>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {index + 1}. {point.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {point.content}
                                </p>
                            </div>
                        ))}
                    </div>


                    {/* Contact Section */}
                    <div className="mt-8 bg-gray-100 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Questions About Your Privacy?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            We're here to help. Contact our privacy team for any concerns.
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Contact Privacy Team
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
