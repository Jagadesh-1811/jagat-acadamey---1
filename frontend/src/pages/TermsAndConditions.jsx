import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaGavel, FaShieldAlt } from 'react-icons/fa';

const TermsAndConditions = () => {
    const navigate = useNavigate();

    const keyTerms = [
        {
            icon: <FaCheckCircle className="text-green-500" />,
            title: "Acceptance of Terms",
            content: "By using Jagat Academy, you agree to these terms. Users must be 13+ years old; users under 18 need parental consent."
        },
        {
            icon: <FaShieldAlt className="text-blue-500" />,
            title: "Account Security",
            content: "You are responsible for maintaining your login credentials. Never share your password. Report unauthorized access immediately."
        },
        {
            icon: <FaGavel className="text-purple-500" />,
            title: "Intellectual Property",
            content: "All courses, videos, and materials are copyrighted. You get a personal, non-transferable license to learn. No copying or redistribution allowed."
        },
        {
            icon: <FaCheckCircle className="text-green-500" />,
            title: "Platform Features",
            content: "Students get access to courses, video lectures, assignments, quizzes, AI chatbot assistance, voice rooms (weekends), and certificates."
        },
        {
            icon: <FaExclamationTriangle className="text-yellow-500" />,
            title: "Prohibited Activities",
            content: "No sharing accounts, hacking, harassment, uploading malware, or unauthorized commercial use. Violations may result in account termination."
        },
        {
            icon: <FaGavel className="text-purple-500" />,
            title: "Payments & Refunds",
            content: "Course prices are in INR. Refund requests must be within 7 days of purchase. No refunds for significantly accessed courses."
        },
        {
            icon: <FaShieldAlt className="text-blue-500" />,
            title: "Voice Rooms & AI",
            content: "Voice rooms are available on weekends only. AI chatbot responses are for educational assistance and may not always be accurate."
        },
        {
            icon: <FaExclamationTriangle className="text-yellow-500" />,
            title: "Liability Limitations",
            content: "We strive for quality but don't guarantee specific outcomes. Our liability is limited to the amount you paid for services."
        },
        {
            icon: <FaCheckCircle className="text-green-500" />,
            title: "Account Termination",
            content: "You can delete your account anytime. We may suspend accounts for Terms violations or 12+ months of inactivity."
        },
        {
            icon: <FaGavel className="text-purple-500" />,
            title: "Governing Law",
            content: "These terms are governed by Indian law. Disputes are subject to Indian courts. Contact official.jagat.services@gmail.com for issues."
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
                        <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
                        <p className="text-gray-400">
                            Last Updated: December 13, 2024
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Jagat Academy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms and Conditions govern your use of our e-learning platform.
                            By accessing or using Jagat Academy, you agree to be bound by these terms.
                            Please read them carefully before using our services.
                        </p>
                    </div>

                    {/* Key Terms Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {keyTerms.map((term, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-black"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xl">{term.icon}</span>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {index + 1}. {term.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {term.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Full Terms Link */}
                    <div className="mt-12 bg-gray-100 rounded-2xl p-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Need More Details?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            For our complete legal documentation, please contact us.
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Contact Support
                        </button>
                    </div>

                    {/* Agreement Notice */}
                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>
                            By using Jagat Academy, you acknowledge that you have read, understood,
                            and agree to these Terms & Conditions.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsAndConditions;
