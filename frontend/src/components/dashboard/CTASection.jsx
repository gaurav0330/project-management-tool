import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const CTASection = () => {
  const { isDark } = useTheme();
  
  return (
    <section className="relative bg-gradient-to-br from-brand-primary-600 via-brand-secondary-500 to-brand-accent-500 text-white section-padding overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-accent-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-brand-secondary-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container max-w-5xl relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/30">
            🚀 Start Your Journey Today
          </div>
          
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ready to <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">Transform</span> Your Project Management?
          </h2>
          
          <p className="font-body text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of teams already using YojanaDesk to deliver projects faster and more efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link 
              to="/signup"
              className="group bg-white text-brand-primary-600 hover:bg-gray-50 font-button font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-button font-semibold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:-translate-y-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M12 2v6m3 9a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Schedule Demo
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-brand-accent-400 to-brand-accent-600 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span className="ml-2 font-medium">Join 10,000+ happy users</span>
            </div>
            
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 font-medium">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
