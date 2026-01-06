import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
    FaWhatsapp,
    FaInstagram,
    FaLinkedin,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaLightbulb,
    FaUpload,
    FaLink,
    FaFileAlt,
    FaCheckCircle
} from 'react-icons/fa';

const Contact = () => {
    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp className="w-6 h-6" />,
            link: 'https://wa.me/917032789801',
            color: 'bg-black',
            handle: '+91 70327 89801'
        },
        {
            name: 'Instagram',
            icon: <FaInstagram className="w-6 h-6" />,
            link: 'https://www.instagram.com/offical.jagat/',
            color: 'bg-black',
            handle: '@official.jagat'
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedin className="w-6 h-6" />,
            link: 'https://linkedin.com/company/jagatacademy',
            color: 'bg-black',
            handle: 'Jagat Academy'
        },
        {
            name: 'Email',
            icon: <FaEnvelope className="w-6 h-6" />,
            link: 'mailto:official.jagat.services@gmail.com',
            color: 'bg-black',
            handle: 'official.jagat.services@gmail.com'
        }
    ];

    const assignmentSteps = [
        {
            step: 1,
            icon: <FaFileAlt className="w-8 h-8" />,
            title: 'View Assignment',
            description: 'Go to your enrolled course and navigate to the Assignments section. Read the assignment instructions carefully.'
        },
        {
            step: 2,
            icon: <FaUpload className="w-8 h-8" />,
            title: 'Prepare Your Work',
            description: 'Complete the assignment as per the given instructions. Upload your work to Google Drive, GitHub, or any file sharing platform.'
        },
        {
            step: 3,
            icon: <FaLink className="w-8 h-8" />,
            title: 'Submit Link',
            description: 'Copy the shareable link of your uploaded work. Make sure the link has proper access permissions (Anyone with link can view).'
        },
        {
            step: 4,
            icon: <FaCheckCircle className="w-8 h-8" />,
            title: 'Wait for Review',
            description: 'Your instructor will review your submission and provide a grade along with feedback. Check your dashboard for updates.'
        }
    ];

    return (
        <div className="w-full min-h-screen bg-white">
            <Nav />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Contact <span className="text-blue-500">Us</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions? We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center hover:shadow-lg transition-shadow">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FaEnvelope className="w-10 h-10 text-blue-600 mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Email Us</h3>
                            <p className="text-gray-600 mb-5 text-lg">We'll respond within 24 hours</p>
                            <a href="mailto:official.jagat.services@gmail.com" className="text-blue-600 font-medium hover:underline text-lg">
                                official.jagat.services@gmail.com
                            </a>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center hover:shadow-lg transition-shadow">
                            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <FaPhone className="w-10 h-10 text-green-600 mx-auto" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Call Us</h3>
                            <p className="text-gray-600 mb-5 text-lg">Mon-Sat, 10am-5pm IST</p>
                            <a href="tel:+917032789801" className="text-green-600 font-medium hover:underline text-lg">
                                +91 70327 89801
                            </a>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connect With Us</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${social.color} text-white rounded-2xl p-8 flex items-center gap-6 transition-none`}
                                >
                                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                        <span className="text-3xl">{social.icon}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl">{social.name}</p>
                                        <p className="text-base text-white/90 mt-1">{social.handle}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Submit Assignment Section */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How to Submit <span className="text-blue-500">Assignment</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Follow these simple steps to submit your assignments and get graded by your instructor.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {assignmentSteps.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <span className="text-4xl font-bold text-gray-200">0{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-300 text-2xl">
                                        →
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tips Box */}
                    <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2"><FaLightbulb /> Important Tips</h3>
                        <ul className="space-y-3 text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Make sure your submission link is accessible (set to "Anyone with link can view")
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Submit before the deadline to avoid late submission penalties
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Use Google Drive, GitHub, or similar platforms to host your files
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                Include your name and roll number in the file if required
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6 bg-black">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
                    <p className="text-gray-400 mb-8">
                        Can't find what you're looking for? Send us your feedback or report an issue.
                    </p>
                    <a
                        href="/feedback"
                        className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl transition-none"
                    >
                        Submit Feedback
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
