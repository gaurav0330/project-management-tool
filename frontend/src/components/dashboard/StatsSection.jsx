import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const StatsSection = () => {
  const { isDark } = useTheme();
  
  const stats = [
    { number: '500+', label: 'Projects Completed', icon: '🎯' },
    { number: '50+', label: 'Active Teams', icon: '👥' },
    { number: '99.9%', label: 'Uptime', icon: '⚡' },
    { number: '24/7', label: 'Support', icon: '🛟' }
  ];

  return (
    <section className="section-padding py-16 bg-bg-primary-light dark:bg-bg-primary-dark border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="section-container">
        {/* ✅ Optional section title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Join thousands of successful projects
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center p-6 rounded-xl bg-bg-accent-light dark:bg-bg-accent-dark hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* ✅ Icon with background */}
              <div className="text-4xl mb-4 p-3 bg-brand-primary-50 dark:bg-brand-primary-900/20 rounded-full inline-block">
                {stat.icon}
              </div>
              
              {/* ✅ Number using heading accent color */}
              <div className="font-heading text-3xl lg:text-4xl font-bold mb-2 text-heading-accent-light dark:text-heading-accent-dark">
                {stat.number}
              </div>
              
              {/* ✅ Label using semantic text */}
              <div className="font-body text-txt-secondary-light dark:text-txt-secondary-dark font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
