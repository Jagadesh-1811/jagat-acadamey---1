import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { FaArrowLeft, FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';

const RefundPolicy = () => {
    const navigate = useNavigate();

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
                        <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
                        <p className="text-gray-400">
                            Last Updated: December 13, 2024
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaMoneyBillWave className="text-green-500 text-3xl" />
                            <h2 className="text-2xl font-bold text-gray-900">Our Commitment to You</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            At Jagat Academy, we want you to be completely satisfied with your learning experience.
                            If a course doesn't meet your expectations, we offer a fair refund policy.
                        </p>
                    </div>

                    {/* Refund Eligibility */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Eligible */}
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center gap-3 mb-4">
                                <FaCheckCircle className="text-green-500 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Eligible for Refund</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    Request within 7 days of purchase
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    Less than 30% of course content accessed
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    Technical issues preventing course access
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    Course content significantly different from description
                                </li>
                            </ul>
                        </div>

                        {/* Not Eligible */}
                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                            <div className="flex items-center gap-3 mb-4">
                                <FaTimesCircle className="text-red-500 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Not Eligible for Refund</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    Request after 7 days of purchase
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    More than 30% of course content accessed
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    Free courses or promotional offers
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    Certificates already downloaded
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Process */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FaClock className="text-blue-500 text-2xl" />
                            <h3 className="text-xl font-semibold text-gray-900">Refund Process</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Submit Request</h4>
                                <p className="text-gray-600 text-sm">Contact our support team with your order details</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Review</h4>
                                <p className="text-gray-600 text-sm">We review your request within 2-3 business days</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
                                <h4 className="font-semibold text-gray-900 mb-2">Refund</h4>
                                <p className="text-gray-600 text-sm">If approved, refund processed within 5-7 business days</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-100 rounded-2xl p-8 text-center">
                        <FaQuestionCircle className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Need Help with a Refund?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Contact us at <span className="font-semibold">official.jagat.services@gmail.com</span> with your order ID.
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RefundPolicy;
