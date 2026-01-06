import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) return; // Already consented, don't show

        // Show cookie popup when user scrolls past 300px
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBanner(true);
                setTimeout(() => setIsVisible(true), 50);
                // Remove scroll listener once shown
                window.removeEventListener('scroll', handleScroll);
            }
        };

        // Also show after 8 seconds if user hasn't scrolled
        const timer = setTimeout(() => {
            if (!showBanner) {
                setShowBanner(true);
                setTimeout(() => setIsVisible(true), 50);
                window.removeEventListener('scroll', handleScroll);
            }
        }, 8000);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, [showBanner]);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setIsVisible(false);
        setTimeout(() => setShowBanner(false), 300);
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Inline styles for animation */}
            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideDown {
                    from {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                }
                .cookie-slide-up {
                    animation: slideUp 0.4s ease-out forwards;
                }
                .cookie-slide-down {
                    animation: slideDown 0.3s ease-in forwards;
                }
            `}</style>

            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: isVisible ? 1 : 0 }}
            />

            {/* Cookie Banner */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 ${isVisible ? 'cookie-slide-up' : 'cookie-slide-down'}`}
            >
                <div
                    className="max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
                    }}
                >
                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-5">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
                                    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.4)'
                                }}
                            >
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">We Value Your Privacy</h3>
                                <p className="text-sm text-gray-500">Cookie consent required</p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-gray-600 text-base mb-4 leading-relaxed">
                            We use cookies to enhance your browsing experience, serve personalized content,
                            and analyze our traffic. By clicking <strong>"Accept All"</strong>, you consent to our use of cookies.
                        </p>

                        <p className="text-gray-500 text-sm mb-6">
                            Learn more about how we use cookies in our{' '}
                            <Link
                                to="/cookies"
                                className="text-gray-800 hover:text-black font-semibold underline underline-offset-2 transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAccept}
                                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                                    boxShadow: '0 8px 20px -6px rgba(0,0,0,0.5)'
                                }}
                            >
                                ✓ Accept All Cookies
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    boxShadow: '0 4px 12px -4px rgba(0,0,0,0.1)'
                                }}
                            >
                                ✗ Decline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CookieConsent;
