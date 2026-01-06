import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaUserCheck,
    FaShieldAlt,
    FaGavel,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCreditCard,
    FaMicrophone,
    FaRobot,
    FaUserSlash,
    FaBalanceScale,
    FaArrowLeft,
    FaChevronDown
} from 'react-icons/fa';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState(null);

    const sections = [
        {
            icon: <FaUserCheck className="text-2xl" />,
            title: "Acceptance of Terms",
            summary: "By using Jagat Academy, you agree to these terms.",
            details: [
                "Users must be 13+ years old to create an account",
                "Users under 18 need parental or guardian consent",
                "Continued use of our platform means acceptance of any updates to these terms",
                "If you disagree with any terms, please discontinue use immediately"
            ]
        },
        {
            icon: <FaShieldAlt className="text-2xl" />,
            title: "Account Security",
            summary: "You are responsible for maintaining your login credentials.",
            details: [
                "Keep your password confidential and secure",
                "Never share your account with others",
                "Report unauthorized access immediately to our support",
                "We reserve the right to suspend compromised accounts"
            ]
        },
        {
            icon: <FaGavel className="text-2xl" />,
            title: "Intellectual Property",
            summary: "All courses and materials are copyrighted.",
            details: [
                "Course content, videos, and materials are owned by Jagat Academy",
                "You receive a personal, non-transferable license to learn",
                "Copying, downloading, or redistribution is strictly prohibited",
                "Screenshots and screen recordings of paid content are not allowed"
            ]
        },
        {
            icon: <FaCheckCircle className="text-2xl" />,
            title: "Platform Features",
            summary: "Access to courses, lectures, and learning tools.",
            details: [
                "Video lectures with progress tracking",
                "Assignments and quizzes for skill assessment",
                "AI chatbot assistance for learning support",
                "Voice rooms for live doubt sessions (weekends)",
                "Certificates upon course completion"
            ]
        },
        {
            icon: <FaExclamationTriangle className="text-2xl" />,
            title: "Prohibited Activities",
            summary: "Actions that may result in account termination.",
            details: [
                "Sharing accounts or login credentials",
                "Attempting to hack or disrupt our systems",
                "Harassment of students, educators, or staff",
                "Uploading malware or malicious content",
                "Unauthorized commercial use of our content"
            ]
        },
        {
            icon: <FaCreditCard className="text-2xl" />,
            title: "Payments & Billing",
            summary: "Course prices and payment processing.",
            details: [
                "All prices are displayed in Indian Rupees (INR)",
                "Payments are processed securely via Razorpay",
                "Course access is granted immediately upon successful payment",
                "Invoice and receipt sent to your registered email"
            ]
        },
        {
            icon: <FaMicrophone className="text-2xl" />,
            title: "Voice Rooms",
            summary: "Live doubt clearing sessions with educators.",
            details: [
                "Voice rooms are available on weekends only",
                "Respectful communication is mandatory",
                "Sessions may be recorded for quality purposes",
                "Educators reserve the right to end disruptive sessions"
            ]
        },
        {
            icon: <FaRobot className="text-2xl" />,
            title: "AI Assistance",
            summary: "AI chatbot for educational support.",
            details: [
                "AI responses are for educational assistance only",
                "Answers may not always be 100% accurate",
                "Do not rely solely on AI for critical decisions",
                "Report any inappropriate AI responses"
            ]
        },
        {
            icon: <FaUserSlash className="text-2xl" />,
            title: "Account Termination",
            summary: "Conditions for account suspension or deletion.",
            details: [
                "You can delete your account anytime from settings",
                "We may suspend accounts for Terms violations",
                "Inactive accounts (12+ months) may be deactivated",
                "Refunds are not available after account termination for violations"
            ]
        },
        {
            icon: <FaBalanceScale className="text-2xl" />,
            title: "Governing Law",
            summary: "Legal jurisdiction and dispute resolution.",
            details: [
                "These terms are governed by Indian law",
                "Disputes are subject to Indian courts",
                "Arbitration may be used for certain disputes",
                "Contact official.jagat.services@gmail.com for legal queries"
            ]
        }
    ];

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-white pt-20 pb-16">
                {/* Hero Header */}
                <div className="bg-black text-white py-16">
                    <div className="max-w-5xl mx-auto px-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-white/10 rounded-2xl">
                                <FaGavel className="text-4xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms & Conditions</h1>
                                <p className="text-gray-400 text-lg">Please read carefully before using our services</p>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-4">Last Updated: December 2024</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-6 py-12">

                    {/* Introduction */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Jagat Academy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms and Conditions govern your use of our e-learning platform. By accessing or using
                            Jagat Academy, you agree to be bound by these terms. We've designed them to be easy to understand
                            while ensuring a safe and productive learning environment for everyone.
                        </p>
                    </div>

                    {/* Accordion Sections */}
                    <div className="space-y-4">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-black transition-all duration-300"
                            >
                                <button
                                    onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                                    className="w-full p-6 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{index + 1}. {section.title}</h3>
                                            <p className="text-gray-500 text-sm">{section.summary}</p>
                                        </div>
                                    </div>
                                    <div className={`text-gray-400 transition-transform ${expandedSection === index ? 'rotate-180' : ''}`}>
                                        <FaChevronDown />
                                    </div>
                                </button>

                                {expandedSection === index && (
                                    <div className="px-6 pb-6">
                                        <div className="ml-18 pl-4 border-l-2 border-gray-200">
                                            <ul className="space-y-3">
                                                {section.details.map((detail, detailIndex) => (
                                                    <li key={detailIndex} className="flex items-start gap-3 text-gray-600">
                                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-black flex-shrink-0" />
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-12 bg-black rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-3">Have Questions?</h3>
                        <p className="text-gray-400 mb-6">
                            Our support team is here to help you understand these terms.
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Contact Support
                        </button>
                    </div>

                    {/* Related Policies */}
                    <div className="mt-10 text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Policies</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link to="/privacy" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/refund" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                            <Link to="/cookies" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Cookie Policy
                            </Link>
                            <Link to="/gdpr" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                GDPR
                            </Link>
                        </div>
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
