import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaLock,
    FaChartBar,
    FaCog,
    FaCreditCard,
    FaCloud,
    FaArrowLeft,
    FaCookie,
    FaGlobe,
    FaShieldAlt,
    FaCheck,
    FaTimes
} from 'react-icons/fa';

const CookiePolicy = () => {
    const navigate = useNavigate();

    const cookieTypes = [
        {
            icon: <FaLock className="text-2xl" />,
            name: "Essential Cookies",
            description: "Required for the website to function. These cookies enable core features like page navigation, secure login, and access control.",
            required: true,
            examples: ["Session authentication", "Security tokens", "Load balancing"]
        },
        {
            icon: <FaChartBar className="text-2xl" />,
            name: "Analytics Cookies",
            description: "Help us understand how visitors interact with our platform. We use this data to improve user experience and content.",
            required: false,
            examples: ["Page views", "Feature usage", "Error tracking"]
        },
        {
            icon: <FaCog className="text-2xl" />,
            name: "Functional Cookies",
            description: "Remember your preferences and settings for a personalized experience. These enhance usability but aren't strictly necessary.",
            required: false,
            examples: ["Language preference", "Theme settings", "Video quality"]
        }
    ];

    const thirdPartyCookies = [
        { name: "Razorpay", purpose: "Payment processing and security", icon: <FaCreditCard /> },
        { name: "Firebase", purpose: "User authentication sessions", icon: <FaLock /> },
        { name: "Cloudinary", purpose: "Media delivery optimization", icon: <FaCloud /> }
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
                                <span className="text-4xl"><FaCookie /></span>
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">Cookie Policy</h1>
                                <p className="text-gray-400 text-lg">How we use cookies to enhance your experience</p>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-4">Last Updated: December 2024</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-6 py-12">

                    {/* What Are Cookies */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <FaCookie className="text-black" /> What Are Cookies?
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Cookies are small text files stored on your device when you visit websites. They help us remember
                            your preferences, keep you logged in, and understand how you use our platform. Think of them as
                            tiny notes that make your experience smoother and more personalized.
                        </p>
                    </div>

                    {/* Cookie Types */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Types of Cookies We Use</h2>
                    <div className="space-y-6 mb-10">
                        {cookieTypes.map((cookie, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-black transition-all duration-300">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-6 bg-black text-white md:w-64 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                                            {cookie.icon}
                                        </div>
                                        <h3 className="font-bold text-lg text-center">{cookie.name}</h3>
                                        <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${cookie.required ? 'bg-white text-black' : 'bg-white/20'}`}>
                                            {cookie.required ? 'Required' : 'Optional'}
                                        </span>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <p className="text-gray-600 mb-4">{cookie.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {cookie.examples.map((example, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                                    {example}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Third-Party Cookies */}
                    <div className="bg-black rounded-2xl p-8 mb-10 text-white">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <FaGlobe /> Third-Party Cookies
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Some of our trusted partners may set their own cookies to provide their services:
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {thirdPartyCookies.map((party, index) => (
                                <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{party.icon}</span>
                                        <h4 className="font-semibold text-white">{party.name}</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm">{party.purpose}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Managing Cookies */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FaShieldAlt className="text-black" /> Managing Your Cookies
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <FaCheck className="text-black mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Browser Settings</h4>
                                        <p className="text-gray-600 text-sm">Manage cookies through your browser's privacy settings</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <FaCheck className="text-black mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Cookie Banner</h4>
                                        <p className="text-gray-600 text-sm">Accept or decline non-essential cookies when you first visit</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <FaCheck className="text-black mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Clear Local Storage</h4>
                                        <p className="text-gray-600 text-sm">Reset your cookie preferences by clearing browser data</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">
                                    <FaTimes className="text-gray-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Note</h4>
                                        <p className="text-gray-600 text-sm">Blocking essential cookies may affect site functionality</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-black rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-3">Questions About Cookies?</h3>
                        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                            Contact us if you have any questions about our cookie practices.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:official.jagat.services@gmail.com"
                                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Email Us
                            </a>
                            <Link
                                to="/"
                                className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/30"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>

                    {/* Related Policies */}
                    <div className="mt-10 text-center">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Related Policies</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link to="/terms" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link to="/privacy" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/refund" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CookiePolicy;
