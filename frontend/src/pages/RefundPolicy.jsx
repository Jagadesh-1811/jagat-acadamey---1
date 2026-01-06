import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaArrowLeft,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaPercent,
    FaWrench,
    FaClipboardList,
    FaGift,
    FaScroll,
    FaEnvelope,
    FaFileInvoice,
    FaUndo,
    FaCheckCircle,
    FaCheck,
    FaTimesCircle,
    FaTimes,
    FaClock,
    FaInfoCircle
} from 'react-icons/fa';

const RefundPolicy = () => {
    const navigate = useNavigate();

    const eligibleReasons = [
        { text: "Request within 7 days of purchase", icon: <FaCalendarAlt /> },
        { text: "Less than 30% of course content accessed", icon: <FaPercent /> },
        { text: "Technical issues preventing course access", icon: <FaWrench /> },
        { text: "Course content significantly different from description", icon: <FaClipboardList /> }
    ];

    const ineligibleReasons = [
        { text: "Request after 7 days of purchase", icon: <FaCalendarAlt /> },
        { text: "More than 30% of course content accessed", icon: <FaPercent /> },
        { text: "Free courses or promotional offers", icon: <FaGift /> },
        { text: "Certificates already downloaded", icon: <FaScroll /> }
    ];

    const processSteps = [
        {
            step: 1,
            title: "Submit Request",
            description: "Email us with your order ID and reason for refund",
            icon: <FaEnvelope />
        },
        {
            step: 2,
            title: "We Review",
            description: "Our team reviews your request within 2-3 business days",
            icon: <FaFileInvoice />
        },
        {
            step: 3,
            title: "Refund Processed",
            description: "If approved, refund credited within 5-7 business days",
            icon: <FaUndo />
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
                                <FaMoneyBillWave className="text-4xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">Refund Policy</h1>
                                <p className="text-gray-400 text-lg">Fair and transparent refund process</p>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-4">Last Updated: December 2024</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto px-6 py-12">

                    {/* Our Commitment */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-black rounded-xl">
                                <FaMoneyBillWave className="text-2xl text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Our Commitment to You</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            At Jagat Academy, we want you to be completely satisfied with your learning experience.
                            If a course doesn't meet your expectations, we offer a fair and transparent refund policy.
                            We believe in earning your trust through quality education.
                        </p>
                    </div>

                    {/* Eligibility Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {/* Eligible */}
                        <div className="bg-white rounded-2xl overflow-hidden border-2 border-black">
                            <div className="bg-black p-6 text-white">
                                <div className="flex items-center gap-3">
                                    <FaCheckCircle className="text-2xl" />
                                    <h3 className="text-xl font-bold flex items-center gap-2"><FaCheck /> Eligible for Refund</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {eligibleReasons.map((reason, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                                            {typeof reason.icon === 'string' ? <span className="text-lg">{reason.icon}</span> : reason.icon}
                                        </div>
                                        <span className="text-gray-700 font-medium">{reason.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Not Eligible */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">
                            <div className="bg-gray-100 p-6">
                                <div className="flex items-center gap-3">
                                    <FaTimesCircle className="text-2xl text-gray-500" />
                                    <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2"><FaTimes /> Not Eligible</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {ineligibleReasons.map((reason, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                                            {typeof reason.icon === 'string' ? <span className="text-lg">{reason.icon}</span> : reason.icon}
                                        </div>
                                        <span className="text-gray-600 font-medium">{reason.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Timeline */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200">
                        <div className="flex items-center gap-3 mb-8">
                            <FaClock className="text-2xl text-black" />
                            <h3 className="text-2xl font-bold text-gray-900">Refund Process</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {processSteps.map((step, index) => (
                                <div key={index} className="relative text-center">
                                    <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center text-sm font-bold text-black">
                                        {step.step}
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h4>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-black rounded-lg text-white flex-shrink-0">
                                <span className="text-xl"><FaInfoCircle /></span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Important Information</h4>
                                <ul className="text-gray-600 text-sm space-y-1">
                                    <li>• Refunds are processed to the original payment method</li>
                                    <li>• Processing time may vary based on your bank</li>
                                    <li>• You'll receive email confirmation at each step</li>
                                    <li>• Course access is revoked upon refund approval</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-black rounded-2xl p-8 text-white text-center">
                        <FaEnvelope className="text-5xl mx-auto mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold mb-3">Need a Refund?</h3>
                        <p className="text-gray-400 mb-2 max-w-lg mx-auto">
                            Contact us at <strong className="text-white">official.jagat.services@gmail.com</strong>
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Please include your Order ID in the email subject
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:official.jagat.services@gmail.com?subject=Refund Request - Order ID: "
                                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                <FaEnvelope /> Request Refund
                            </a>
                            <button
                                onClick={() => navigate('/contact')}
                                className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/30"
                            >
                                Contact Support
                            </button>
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
                            <Link to="/cookies" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                Cookie Policy
                            </Link>
                            <Link to="/gdpr" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-black hover:text-white transition-colors">
                                GDPR
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RefundPolicy;
