import React from "react";
import { motion } from "framer-motion";
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

const SocialIcon = ({ icon, href, color }) => {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${color} rounded-full p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg`}
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
      className="text-black hover:text-gray-700 transition-colors duration-300 text-sm md:text-base"
      whileHover={{ x: 5 }}
    >
      {text}
    </motion.a>
  );
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-gradient-to-r from-gray-200 to-gray-300 text-black py-12 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              ProjectFlow
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-primary-500"></span>
            </motion.h3>
            <p className="text-black mb-4 text-sm leading-relaxed">
              Streamline your workflow with our intuitive project management solution. Built for teams that value efficiency and collaboration.
            </p>
            <div className="flex space-x-3">
              <SocialIcon icon={<FaFacebook className="text-xl" />} href="#" color="bg-blue-600 text-white" />
              <SocialIcon icon={<FaTwitter className="text-xl" />} href="#" color="bg-sky-500 text-white" />
              <SocialIcon icon={<FaLinkedin className="text-xl" />} href="#" color="bg-blue-700 text-white" />
              <SocialIcon icon={<FaInstagram className="text-xl" />} href="#" color="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white" />
              <SocialIcon icon={<FaGithub className="text-xl" />} href="#" color="bg-gray-800 text-white" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-primary-500"></span>
            </motion.h3>
            <ul className="space-y-2">
              <li><FooterLink text="Home" href="#" /></li>
              <li><FooterLink text="Features" href="#" /></li>
              <li><FooterLink text="Pricing" href="#" /></li>
              <li><FooterLink text="Testimonials" href="#" /></li>
              <li><FooterLink text="Blog" href="#" /></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Legal
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-primary-500"></span>
            </motion.h3>
            <ul className="space-y-2">
              <li><FooterLink text="Privacy Policy" href="#" /></li>
              <li><FooterLink text="Terms of Service" href="#" /></li>
              <li><FooterLink text="Cookie Policy" href="#" /></li>
              <li><FooterLink text="GDPR Compliance" href="#" /></li>
              <li><FooterLink text="Security" href="#" /></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4 relative inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-primary-500"></span>
            </motion.h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-black text-sm">1234 Innovation Drive, Tech Valley, CA 94043</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-500 flex-shrink-0" />
                <a href="mailto:contact@projectflow.com" className="text-black hover:text-gray-700 text-sm transition-colors duration-300">contact@projectflow.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-500 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-black hover:text-gray-700 text-sm transition-colors duration-300">(123) 456-7890</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-400 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-black text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} YOJANDESK. All rights reserved.
          </p>
          <motion.button 
            onClick={scrollToTop}
            className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full transition-colors duration-300 ml-4"
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
