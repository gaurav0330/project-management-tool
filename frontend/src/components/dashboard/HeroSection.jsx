import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const HeroSection = () => {
  const { isDark } = useTheme();

  return (
    <section className="relative section-padding py-16 overflow-hidden bg-gradient-to-br from-brand-primary-600 via-brand-primary-700 to-brand-secondary-600 dark:from-bg-secondary-dark dark:via-bg-primary-dark dark:to-bg-accent-dark text-white dark:text-txt-primary-dark transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300/10 dark:bg-brand-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 dark:bg-brand-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 dark:bg-brand-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* ✅ Badge using similar styling to stats cards */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-3 bg-white/20 dark:bg-bg-accent-dark/50 backdrop-blur-sm rounded-xl text-sm font-medium border border-white/30 dark:border-gray-600 transition-all duration-300 hover:bg-white/30 dark:hover:bg-bg-accent-dark/70">
              🚀 The Future of Project Management
            </span>
          </motion.div>

          {/* ✅ Main heading using font-heading like stats */}
          <motion.h1 
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white dark:text-heading-primary-dark"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Streamline Your{' '}
            <span className="text-yellow-300 dark:text-heading-accent-dark">Software Projects</span>
          </motion.h1>
          
          {/* ✅ Subtitle using font-body like stats */}
          <motion.p 
            className="font-body text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 dark:text-txt-secondary-dark leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Domain-based project management that connects managers, team leads, and developers seamlessly
          </motion.p>
          
          {/* ✅ Buttons with improved styling similar to stats hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/signup" 
              className="font-button bg-white dark:bg-interactive-primary-dark text-brand-primary-600 dark:text-white hover:bg-gray-100 dark:hover:bg-interactive-hover-dark font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            
            <button className="font-button border-2 border-white dark:border-interactive-primary-dark text-white dark:text-interactive-primary-dark hover:bg-white hover:text-brand-primary-600 dark:hover:bg-interactive-primary-dark dark:hover:text-white font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              Watch Demo
            </button>
          </motion.div>

          {/* ✅ Trust indicators with stats-like styling */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center p-4 rounded-xl bg-white/10 dark:bg-bg-accent-dark/50 backdrop-blur-sm border border-white/20 dark:border-gray-600 transition-all duration-300 hover:bg-white/20 dark:hover:bg-bg-accent-dark/70">
              <div className="font-heading text-2xl font-bold mb-1 text-white dark:text-heading-primary-dark">500+</div>
              <div className="font-body text-sm text-blue-100 dark:text-txt-secondary-dark">Trusted Teams</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-white/10 dark:bg-bg-accent-dark/50 backdrop-blur-sm border border-white/20 dark:border-gray-600 transition-all duration-300 hover:bg-white/20 dark:hover:bg-bg-accent-dark/70">
              <div className="font-heading text-2xl font-bold mb-1 text-white dark:text-heading-primary-dark">4.9★</div>
              <div className="font-body text-sm text-blue-100 dark:text-txt-secondary-dark">User Rating</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-white/10 dark:bg-bg-accent-dark/50 backdrop-blur-sm border border-white/20 dark:border-gray-600 transition-all duration-300 hover:bg-white/20 dark:hover:bg-bg-accent-dark/70">
              <div className="font-heading text-2xl font-bold mb-1 text-white dark:text-heading-primary-dark">99.9%</div>
              <div className="font-body text-sm text-blue-100 dark:text-txt-secondary-dark">Uptime</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
