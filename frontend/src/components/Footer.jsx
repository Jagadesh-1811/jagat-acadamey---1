import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import logo from '../assets/logo.jpg';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Jagat Academy" className="w-12 h-12 rounded-lg object-cover" />
              <h3 className="text-xl font-bold">JAGAT ACADEMY</h3>
              <p className="text-xs text-gray-400 -mt-2">Integrated E-Learning Platform</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners with quality education.
              Master new skills, earn certifications, and
              transform your career with expert-led courses.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <FacebookOutlinedIcon sx={{ fontSize: 22 }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <TwitterIcon sx={{ fontSize: 22 }} />
              </a>
              <a href="https://www.instagram.com/offical.jagat/" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <InstagramIcon sx={{ fontSize: 22 }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors">
                <LinkedInIcon sx={{ fontSize: 22 }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/allcourses" className="text-gray-400 hover:text-white transition-colors text-sm">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <EmailOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
                <a href="mailto:official.jagat.services@gmail.com" className="hover:text-white transition-colors">
                  official.jagat.services@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <PhoneOutlinedIcon sx={{ color: 'white', fontSize: 18 }} />
                <a href="tel:+918919548737" className="hover:text-white transition-colors">
                  +91 8919548737
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <LocationOnOutlinedIcon sx={{ color: 'white', fontSize: 18, marginTop: '2px' }} />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Jagat Academy Integrated E-Learning Platform. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs flex items-center">
              Made with <FavoriteIcon sx={{ color: '#ef4444', fontSize: 14, mx: 0.5 }} /> for learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
