import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaGraduationCap,
    FaPlay,
    FaInfinity,
    FaCertificate,
    FaHeadset,
    FaHeart,
    FaGlobe,
    FaShieldAlt,
    FaBookOpen,
    FaAward,
    FaUsers,
    FaStar,
    FaLightbulb,
    FaRocket,
    FaArrowRight,
    FaChartLine
} from 'react-icons/fa';
import { TbBrain, TbTargetArrow } from 'react-icons/tb';
import { BsLightningCharge, BsRocketTakeoff } from 'react-icons/bs';
import { HiAcademicCap, HiSparkles, HiBadgeCheck } from 'react-icons/hi';

const About = () => {
    const features = [
        {
            icon: <TbBrain className="w-8 h-8" />,
            title: "AI-Powered Learning",
            description: "Smart recommendations and personalized learning paths powered by artificial intelligence."
        },
        {
            icon: <FaGraduationCap className="w-8 h-8" />,
            title: "Expert Instructors",
            description: "Learn from industry professionals with years of real-world experience."
        },
        {
            icon: <FaPlay className="w-8 h-8" />,
            title: "Interactive Courses",
            description: "Engaging video content with hands-on projects and assignments."
        },
        {
            icon: <FaInfinity className="w-8 h-8" />,
            title: "Lifetime Access",
            description: "Once enrolled, access your courses forever with free updates."
        },
        {
            icon: <TbTargetArrow className="w-8 h-8" />,
            title: "Verified Certificates",
            description: "Earn recognized certificates upon successful course completion."
        },
        {
            icon: <FaHeadset className="w-8 h-8" />,
            title: "Live Doubt Sessions",
            description: "Get your questions answered through live interactive sessions."
        }
    ];

    const coreValues = [
        {
            icon: <FaHeart className="w-6 h-6" />,
            title: "Learners First",
            description: "Every decision we make starts with one question: How does this help our learners succeed?"
        },
        {
            icon: <FaGlobe className="w-6 h-6" />,
            title: "Accessible Education",
            description: "Quality education should know no boundaries—geographical, financial, or social."
        },
        {
            icon: <BsLightningCharge className="w-6 h-6" />,
            title: "Continuous Innovation",
            description: "We embrace cutting-edge technology to deliver the best learning experiences."
        },
        {
            icon: <FaShieldAlt className="w-6 h-6" />,
            title: "Excellence & Integrity",
            description: "We maintain the highest standards in content quality and ethical practices."
        }
    ];

    const learningSteps = [
        {
            step: "01",
            title: "Discover",
            description: "Explore our curated courses designed by industry experts. Find the perfect learning path for your goals.",
            icon: <FaBookOpen className="w-8 h-8" />
        },
        {
            step: "02",
            title: "Learn",
            description: "Engage with interactive content, complete projects, and get real-time support from instructors.",
            icon: <HiAcademicCap className="w-8 h-8" />
        },
        {
            step: "03",
            title: "Achieve",
            description: "Earn certificates, build your portfolio, and unlock new career opportunities.",
            icon: <FaAward className="w-8 h-8" />
        }
    ];

    const stats = [
        { number: "100+", label: "Courses" },
        { number: "50K+", label: "Learners" },
        { number: "25+", label: "Expert Instructors" },
        { number: "4.8", label: "Average Rating" }
    ];

    return (
        <div className="w-full overflow-hidden bg-white min-h-screen">
            <Nav />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 bg-black overflow-hidden">
                {/* Subtle gradient overlays */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
                        <HiSparkles className="text-blue-400" />
                        <span className="text-gray-300 text-sm">Transforming Lives Through Learning</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        About <span className="text-blue-500">Jagat Academy</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Where passion meets purpose, and learning transforms into lifelong success
                    </p>
                </div>
            </section>

            {/* Origin Story Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
                                <FaLightbulb className="text-blue-500" />
                                <span className="text-gray-600 text-sm font-medium">Our Story</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                                How It All <span className="text-blue-500">Began</span>
                            </h2>

                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p>
                                    Jagat Academy was born from a simple yet powerful belief: <strong className="text-black">quality education should be accessible to everyone, everywhere.</strong>
                                </p>
                                <p>
                                    We witnessed countless talented individuals held back not by ability, but by lack of access to quality learning resources. Traditional education often comes with barriers—high costs, geographical limitations, and rigid schedules that don't fit modern lifestyles.
                                </p>
                                <p>
                                    That's why we built Jagat Academy—a platform where <span className="text-blue-500 font-semibold">ambition meets opportunity</span>. We combine cutting-edge AI technology with expert-led instruction to create personalized learning experiences that adapt to each student's unique journey.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-black rounded-3xl p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                                <blockquote className="relative">
                                    <div className="text-6xl text-blue-500 opacity-50 mb-4">"</div>
                                    <p className="text-white text-xl md:text-2xl font-medium leading-relaxed mb-6">
                                        Education is not the filling of a pail, but the lighting of a fire. We're here to ignite that fire in every learner.
                                    </p>
                                    <footer className="text-gray-400">
                                        <span className="text-blue-400 font-semibold">— Jagat Academy</span>
                                        <br />
                                        <span className="text-sm">Our Founding Philosophy</span>
                                    </footer>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Our <span className="text-blue-500">Mission & Vision</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Guided by purpose, driven by impact
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Card */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <TbTargetArrow className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                To democratize education by providing accessible, affordable, and high-quality learning experiences that empower individuals to achieve their personal and professional goals—regardless of their background or location.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-black rounded-3xl p-10 border border-gray-800 hover:border-gray-600 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BsRocketTakeoff className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                A world where every learner has the power to transform their life through education. We envision becoming the leading AI-powered learning platform that shapes the future of global education.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            What We <span className="text-blue-500">Stand For</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Our core values guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-500/50 hover:bg-white hover:shadow-lg transition-all duration-500"
                            >
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-5 group-hover:bg-blue-500 transition-colors duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-lg font-bold text-black mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Why Choose Us Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Why Choose <span className="text-blue-500">Jagat Academy?</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover what makes us the preferred choice for thousands of learners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                {/* Accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Journey Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Your Learning <span className="text-blue-500">Journey</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            A simple, powerful path from curiosity to mastery
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection line (desktop only) */}
                        <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-gray-200 via-blue-500 to-gray-200"></div>

                        {learningSteps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                <div className="relative z-10 bg-white">
                                    <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center text-white mx-auto mb-6 hover:bg-blue-500 transition-colors duration-300">
                                        {step.icon}
                                    </div>
                                    <div className="text-blue-500 text-sm font-bold mb-2">STEP {step.step}</div>
                                    <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
                        <FaHeart className="text-blue-500" />
                        <span className="text-blue-600 text-sm font-medium">Our Promise</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                        Our Commitment <span className="text-blue-500">To You</span>
                    </h2>

                    <p className="text-gray-700 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
                        We're not just building a platform—we're building futures. Every course, every feature, every interaction is designed with one goal: <strong className="text-black">your success</strong>. We promise to continuously innovate, listen to your feedback, and never stop improving your learning experience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <FaChartLine className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                            <h4 className="font-bold text-black mb-2">Continuous Improvement</h4>
                            <p className="text-gray-600 text-sm">We constantly update our courses and platform</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <FaHeadset className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                            <h4 className="font-bold text-black mb-2">24/7 Support</h4>
                            <p className="text-gray-600 text-sm">Help is always just a message away</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <FaShieldAlt className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                            <h4 className="font-bold text-black mb-2">Quality Guarantee</h4>
                            <p className="text-gray-600 text-sm">Industry-leading content standards</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-black rounded-3xl p-12 md:p-16 overflow-hidden">
                        {/* Gradient overlays */}
                        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                        <div className="relative">
                            <FaRocket className="w-16 h-16 text-white mx-auto mb-8 animate-bounce" />

                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Ready to Start Your <span className="text-blue-500">Learning Journey?</span>
                            </h2>

                            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                                Join thousands of learners who are already transforming their careers with Jagat Academy. Your future starts here.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => window.location.href = '/allcourses'}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl transition-none"
                                >
                                    Explore Courses
                                    <FaArrowRight />
                                </button>
                                <button
                                    onClick={() => window.location.href = '/register'}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl transition-none"
                                >
                                    Get Started Free
                                    <HiSparkles />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
