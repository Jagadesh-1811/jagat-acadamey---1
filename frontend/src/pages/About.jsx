import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { FaLinkedin, FaRocket, FaGraduationCap, FaPlay, FaInfinity, FaCertificate, FaHeadset } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { TbBrain } from 'react-icons/tb';

// Team member images
import teamDeveloper from '../assets/team_developer.png';
import teamFrontend from '../assets/team_frontend.png';
import teamBackend from '../assets/team_backend.png';
import teamDesigner from '../assets/team_designer.png';

const About = () => {
    const features = [
        {
            icon: <TbBrain className="w-10 h-10" />,
            title: "AI-Powered Learning",
            description: "Smart recommendations and personalized learning paths powered by artificial intelligence.",
            accent: "from-blue-500 to-cyan-400"
        },
        {
            icon: <FaGraduationCap className="w-10 h-10" />,
            title: "Expert Trainers",
            description: "Learn from industry professionals with years of real-world experience.",
            accent: "from-green-500 to-emerald-400"
        },
        {
            icon: <FaPlay className="w-10 h-10" />,
            title: "Interactive Courses",
            description: "Engaging video content with hands-on projects and assignments.",
            accent: "from-orange-500 to-amber-400"
        },
        {
            icon: <FaInfinity className="w-10 h-10" />,
            title: "Lifetime Access",
            description: "Once enrolled, access your courses forever with free updates.",
            accent: "from-purple-500 to-violet-400"
        },
        {
            icon: <FaCertificate className="w-10 h-10" />,
            title: "Certificates",
            description: "Earn recognized certificates upon successful course completion.",
            accent: "from-pink-500 to-rose-400"
        },
        {
            icon: <FaHeadset className="w-10 h-10" />,
            title: "Live Doubt Sessions",
            description: "Get your questions answered through live interactive sessions.",
            accent: "from-red-500 to-orange-400"
        }
    ];

    const teamMembers = [
        {
            name: "Jagadeeshwar CV",
            role: "Full stack Developer",
            description: "Full-stack development lead with expertise in building scalable applications.",
            image: teamDeveloper,
            linkedin: "linkedin.com/in/jagadeeshwar-cv-018548316/",
            email: "jagadeshwar2014@gmail.com",
            accent: "from-blue-500 to-cyan-400"
        },
        {
            name: "Vishnuvardhan AC",
            role: "Front-end Developer",
            description: "UI implementation specialist crafting beautiful and responsive interfaces.",
            image: teamFrontend,
            linkedin: "https://linkedin.com",
            email: "frontend@jagatacademy.com",
            accent: "from-green-500 to-emerald-400"
        },
        {
            name: "Sarthak Roy Kondeti",
            role: "video editor and photo editor",
            description: "",
            image: teamBackend,
            linkedin: "https://www.linkedin.com/in/kondeti-sarthak-roy-772762394/",
            email: "kondetisarthak27@gmail.com",
            accent: "from-orange-500 to-amber-400"
        },
        {
            name: "Sneha Reddy",
            role: "UI Designer",
            description: "User experience and visual design expert creating intuitive interfaces.",
            image: teamDesigner,
            linkedin: "https://linkedin.com",
            email: "design@jagatacademy.com",
            accent: "from-purple-500 to-violet-400"
        }
    ];

    return (
        <div className="w-full overflow-hidden bg-white min-h-screen">
            <Nav />

            {/* Hero Section - Black & White with accent */}
            <section className="relative pt-32 pb-20 px-6 bg-black">
                <div className="relative max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        About <span className="text-blue-500">Jagat Academy</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Empowering learners worldwide with cutting-edge AI-powered education
                    </p>
                </div>

                {/* Subtle colorful accents */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-green-500/20 rounded-full blur-2xl"></div>
            </section>

            {/* About Us Section - White background */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                                Our <span className="text-blue-500">Mission</span>
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                At Jagat Academy, we believe that quality education should be accessible to everyone.
                                Our mission is to bridge the gap between traditional learning and modern technology,
                                providing students with an AI-powered platform that adapts to their unique learning style.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                We are committed to delivering world-class courses in Web Development, AI/ML,
                                Data Science, UI/UX Design, and more, taught by industry experts who bring
                                real-world experience to every lesson.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="relative bg-black rounded-3xl p-8 border border-gray-200 shadow-xl">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div className="p-4">
                                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-2">100+</h3>
                                        <p className="text-gray-300">Courses</p>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 mb-2">50K+</h3>
                                        <p className="text-gray-300">Students</p>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 mb-2">25+</h3>
                                        <p className="text-gray-300">Instructors</p>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-400 mb-2">4.8</h3>
                                        <p className="text-gray-300">Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Light gray background */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                            Why Choose <span className="text-blue-500">Jagat Academy?</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover the features that make us the preferred choice for thousands of learners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="relative">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.accent} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                                {/* Color accent line at bottom */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.accent} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section - Black background */}
            <section className="py-20 px-6 bg-black">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Meet Our <span className="text-blue-500">Team</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            The talented individuals behind Jagat Academy's success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group relative"
                            >
                                {/* Card with glassmorphism */}
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                                    {/* Color accent glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    {/* Avatar with colored border */}
                                    <div className="relative mb-6">
                                        <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden p-1 bg-gradient-to-r ${member.accent}`}>
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="relative text-center">
                                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                        <p className={`font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r ${member.accent}`}>{member.role}</p>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.description}</p>

                                        {/* Social Links */}
                                        <div className="flex justify-center gap-4">
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                                            >
                                                <FaLinkedin className="w-5 h-5" />
                                            </a>
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500 hover:scale-110 transition-all duration-300"
                                            >
                                                <HiMail className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - White with accent */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-black rounded-3xl p-12 overflow-hidden">
                        {/* Colorful accents */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>

                        <div className="relative">
                            <FaRocket className="w-16 h-16 text-white mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Start Your Learning Journey?
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of students who are already transforming their careers with Jagat Academy.
                            </p>
                            <button
                                onClick={() => window.location.href = '/allcourses'}
                                className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                Explore Courses
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
