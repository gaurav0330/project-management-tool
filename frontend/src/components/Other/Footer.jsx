import React from "react";
import { motion } from "framer-motion";
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaGithub, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone,
  FaArrowUp
} from "react-icons/fa";

const SocialIcon = ({ icon, href, colorClass }) => {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${colorClass} rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon}
    </motion.a>
  );
};

const FooterLink = ({ text, href }) => {
  return (
    <motion.a 
      href={href}
      className="text-txt-secondary-light dark:text-txt-secondary-dark hover:text-heading-accent-light dark:hover:text-heading-accent-dark transition-colors duration-300 text-sm md:text-base"
      whileHover={{ x: 5 }}
    >
      {text}
    </motion.a>
  );
};

export default function Footer() {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300 section-padding relative">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary-500 via-brand-secondary-500 to-brand-accent-500"></div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <motion.h3 
              className="font-heading text-xl font-bold mb-4 relative inline-block text-heading-primary-light dark:text-heading-primary-dark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              YojanaDesk
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500"></span>
            </motion.h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6 text-sm leading-relaxed">
              Streamline your software development workflow with our intuitive project management solution. Built for teams that value efficiency and collaboration.
            </p>
            <div className="flex space-x-3">
              <SocialIcon 
                icon={<FaFacebook className="text-xl" />} 
                href="#" 
                colorClass="bg-blue-600 text-white hover:bg-blue-700" 
              />
              <SocialIcon 
                icon={<FaTwitter className="text-xl" />} 
                href="#" 
                colorClass="bg-sky-500 text-white hover:bg-sky-600" 
              />
              <SocialIcon 
                icon={<FaLinkedin className="text-xl" />} 
                href="#" 
                colorClass="bg-blue-700 text-white hover:bg-blue-800" 
              />
              <SocialIcon 
                icon={<FaInstagram className="text-xl" />} 
                href="#" 
                colorClass="bg-gradient-to-br from-brand-secondary-500 via-pink-500 to-brand-accent-500 text-white hover:from-brand-secondary-600 hover:via-pink-600 hover:to-brand-accent-600" 
              />
              <SocialIcon 
                icon={<FaGithub className="text-xl" />} 
                href="#" 
                colorClass="bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600" 
              />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <motion.h3 
              className="font-heading text-xl font-bold mb-4 relative inline-block text-heading-primary-light dark:text-heading-primary-dark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500"></span>
            </motion.h3>
            <ul className="space-y-3">
              <li><FooterLink text="Home" href="/" /></li>
              <li><FooterLink text="Features" href="#features" /></li>
              <li><FooterLink text="How It Works" href="#how-it-works" /></li>
              <li><FooterLink text="Testimonials" href="#testimonials" /></li>
              <li><FooterLink text="FAQ" href="#faq" /></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <motion.h3 
              className="font-heading text-xl font-bold mb-4 relative inline-block text-heading-primary-light dark:text-heading-primary-dark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Legal
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500"></span>
            </motion.h3>
            <ul className="space-y-3">
              <li><FooterLink text="Privacy Policy" href="/privacy" /></li>
              <li><FooterLink text="Terms of Service" href="/terms" /></li>
              <li><FooterLink text="Cookie Policy" href="/cookies" /></li>
              <li><FooterLink text="GDPR Compliance" href="/gdpr" /></li>
              <li><FooterLink text="Security" href="/security" /></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <motion.h3 
              className="font-heading text-xl font-bold mb-4 relative inline-block text-heading-primary-light dark:text-heading-primary-dark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500"></span>
            </motion.h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-brand-primary-500 mt-1 flex-shrink-0" />
                <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
                  Maharashtra
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-brand-primary-500 flex-shrink-0" />
                <a 
                  href="mailto:contact@yojanadesk.com" 
                  className="font-body text-txt-secondary-light dark:text-txt-secondary-dark hover:text-heading-accent-light dark:hover:text-heading-accent-dark text-sm transition-colors duration-300"
                >
                  gauravjikar070806@gmaiil.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-brand-primary-500 flex-shrink-0" />
                <a 
                  href="tel:+11234567890" 
                  className="font-body text-txt-secondary-light dark:text-txt-secondary-dark hover:text-heading-accent-light dark:hover:text-heading-accent-dark text-sm transition-colors duration-300"
                >
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} YojanaDesk. All rights reserved. Built with ❤️ for developers.
          </p>
          <motion.button 
            onClick={scrollToTop}
            className="bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
