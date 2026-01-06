import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaArrowLeft,
    FaShieldAlt,
    FaClipboardList,
    FaChevronRight,
    FaUserCog,
    FaDatabase,
    FaBell,
    FaCheck,
    FaLock,
    FaKey,
    FaServer,
    FaEye,
    FaTrash,
    FaEnvelope
} from 'react-icons/fa';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');

    const tableOfContents = [
        { id: 'overview', title: 'Overview' },
        { id: 'information', title: 'Information We Collect' },
        { id: 'usage', title: 'How We Use Your Data' },
        { id: 'sharing', title: 'Data Sharing' },
        { id: 'security', title: 'Security Measures' },
        { id: 'rights', title: 'Your Rights' },
        { id: 'cookies', title: 'Cookies' },
        { id: 'retention', title: 'Data Retention' },
        { id: 'contact', title: 'Contact Us' }
    ];

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle scroll to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = tableOfContents.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 200;

            sections.forEach((section, index) => {
                if (section) {
                    const top = section.offsetTop;
                    const height = section.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(tableOfContents[index].id);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-white pt-20 pb-16">
                {/* Hero Header */}
                <div className="bg-black text-white py-12">
                    <div className="max-w-6xl mx-auto px-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
                        >
                            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/10 rounded-2xl">
                                <FaShieldAlt className="text-4xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
                                <p className="text-gray-400">Last Updated: December 28, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Information Summary - Coursera Style */}
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="bg-gray-50 border-l-4 border-black rounded-r-xl p-6 mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FaClipboardList /> Key Information at a Glance
                        </h2>
                        <ul className="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                We collect only data necessary to provide our services
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                Your data is encrypted and securely stored
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                We never sell your personal information
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                You can request data deletion anytime
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                We use cookies for authentication and analytics
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-black font-bold">•</span>
                                Contact us at official.jagat.services@gmail.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content with Sidebar - Netflix/Udemy Style */}
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sticky Sidebar Navigation */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="lg:sticky lg:top-24">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Contents</h3>
                                <nav className="space-y-1">
                                    {tableOfContents.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${activeSection === item.id
                                                ? 'bg-black text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {activeSection === item.id && <FaChevronRight className="text-xs" />}
                                            {item.title}
                                        </button>
                                    ))}
                                </nav>

                                {/* Quick Links */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Related</h3>
                                    <div className="space-y-2">
                                        <Link to="/terms" className="block text-sm text-gray-600 hover:text-black transition-colors">
                                            Terms & Conditions
                                        </Link>
                                        <Link to="/cookies" className="block text-sm text-gray-600 hover:text-black transition-colors">
                                            Cookie Policy
                                        </Link>
                                        <Link to="/refund" className="block text-sm text-gray-600 hover:text-black transition-colors">
                                            Refund Policy
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 max-w-3xl">
                            {/* Section: Overview */}
                            <section id="overview" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    1. Overview
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    At Jagat Academy, we are committed to protecting your privacy. This Privacy Policy explains
                                    how we collect, use, disclose, and safeguard your information when you use our e-learning platform.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    By using Jagat Academy, you agree to the collection and use of information in accordance with
                                    this policy. If you do not agree with the terms of this policy, please do not access the platform.
                                </p>
                            </section>

                            {/* Section: Information We Collect */}
                            <section id="information" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    2. Information We Collect
                                </h2>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    When you register on our platform, we collect:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                    <li>Full name</li>
                                    <li>Email address</li>
                                    <li>Profile photo (optional)</li>
                                    <li>Role selection (Student or Educator)</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Learning Data</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    To provide personalized learning experiences, we track:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                    <li>Course enrollments and progress</li>
                                    <li>Quiz scores and assignment submissions</li>
                                    <li>Certificates earned</li>
                                    <li>Video watch history</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Technical Data</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We automatically collect certain information:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li>IP address and browser type</li>
                                    <li>Device information</li>
                                    <li>Session data and login timestamps</li>
                                </ul>
                            </section>

                            {/* Section: How We Use Your Data */}
                            <section id="usage" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    3. How We Use Your Data
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We use the information we collect for the following purposes:
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                            <FaUserCog />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Account Management</h4>
                                            <p className="text-gray-600 text-sm">Create and manage your user account</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                            <FaDatabase />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Course Delivery</h4>
                                            <p className="text-gray-600 text-sm">Provide access to courses, track progress, generate certificates</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                            <FaBell />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Communications</h4>
                                            <p className="text-gray-600 text-sm">Send course updates, announcements, and support responses</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Data Sharing */}
                            <section id="sharing" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    4. Data Sharing
                                </h2>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                    <p className="text-green-800 font-medium flex items-center gap-2">
                                        <FaCheck /> We never sell your personal data to third parties.
                                    </p>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We may share your data only in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li><strong>Service Providers:</strong> With trusted partners who help us operate our platform (authentication, payment processing, cloud storage)</li>
                                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                    <li><strong>With Your Consent:</strong> When you explicitly agree to share specific information</li>
                                </ul>
                                <p className="text-gray-600 leading-relaxed mt-4">
                                    All our service providers are contractually obligated to protect your data and use it only
                                    for the purposes we specify.
                                </p>
                            </section>

                            {/* Section: Security */}
                            <section id="security" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    5. Security Measures
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    We implement industry-standard security measures to protect your data:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-6 border border-gray-200 rounded-xl">
                                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <FaLock className="text-xl text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Encryption</h4>
                                        <p className="text-gray-500 text-xs">bcrypt password hashing, HTTPS/SSL</p>
                                    </div>
                                    <div className="text-center p-6 border border-gray-200 rounded-xl">
                                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <FaKey className="text-xl text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">JWT Tokens</h4>
                                        <p className="text-gray-500 text-xs">Secure session management</p>
                                    </div>
                                    <div className="text-center p-6 border border-gray-200 rounded-xl">
                                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <FaServer className="text-xl text-white" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Secure Storage</h4>
                                        <p className="text-gray-500 text-xs">MongoDB Atlas enterprise security</p>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Your Rights */}
                            <section id="rights" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    6. Your Rights
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    You have the following rights regarding your personal data:
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                                        <FaEye className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Right to Access</h4>
                                            <p className="text-gray-600 text-sm">Request a copy of all personal data we hold about you</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                                        <FaUserCog className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                                            <p className="text-gray-600 text-sm">Update or correct any inaccurate information</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                                        <FaTrash className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Right to Erasure</h4>
                                            <p className="text-gray-600 text-sm">Request deletion of your personal data</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                                        <FaBell className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Right to Opt-out</h4>
                                            <p className="text-gray-600 text-sm">Unsubscribe from marketing communications</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section: Cookies */}
                            <section id="cookies" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    7. Cookies
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We use cookies and similar technologies to enhance your experience. For detailed information
                                    about how we use cookies, please see our <Link to="/cookies" className="text-black font-medium underline">Cookie Policy</Link>.
                                </p>
                            </section>

                            {/* Section: Data Retention */}
                            <section id="retention" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    8. Data Retention
                                </h2>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li><strong>Account data:</strong> Retained until you delete your account</li>
                                    <li><strong>Learning progress:</strong> Retained for the duration of your account</li>
                                    <li><strong>Certificates:</strong> Stored indefinitely for verification purposes</li>
                                    <li><strong>Payment records:</strong> Retained for 7 years (legal requirement)</li>
                                </ul>
                            </section>

                            {/* Section: Contact */}
                            <section id="contact" className="mb-12 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    9. Contact Us
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    If you have any questions about this Privacy Policy or wish to exercise your rights,
                                    please contact us:
                                </p>
                                <div className="bg-black text-white rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaEnvelope />
                                        <span className="font-medium">official.jagat.services@gmail.com</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">We respond to all inquiries within 48 hours.</p>
                                </div>
                            </section>

                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
