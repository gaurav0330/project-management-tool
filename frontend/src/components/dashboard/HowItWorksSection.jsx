import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const HowItWorksSection = () => {
  const { isDark } = useTheme();
  
  const steps = [
    {
      step: '1',
      title: 'Manager Creates Project',
      description: 'Project managers create new projects and define domain requirements (Frontend, Backend, DevOps, etc.)',
      icon: '🎯'
    },
    {
      step: '2', 
      title: 'Assign Domain Leads',
      description: 'Assign specialized team leads for each domain who understand the technical requirements',
      icon: '👥'
    },
    {
      step: '3',
      title: 'Teams Formation',
      description: 'Team leads create focused teams and break down tasks for their domain expertise',
      icon: '⚡'
    },
    {
      step: '4',
      title: 'Development & Review',
      description: 'Members work on tasks, submit to leads for review, then leads submit to managers for final approval',
      icon: '✅'
    }
  ];

  return (
    <section className="section-padding bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-heading-primary-light dark:text-heading-primary-dark">
            How YojanaDesk Works
          </h2>
          <p className="font-body text-xl text-txt-secondary-light dark:text-txt-secondary-dark max-w-3xl mx-auto">
            Our streamlined workflow ensures efficient project delivery through structured collaboration
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Step Card */}
              <div className="card text-center h-full hover:shadow-2xl transform hover:-translate-y-2 group relative overflow-hidden">
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white rounded-full flex items-center justify-center font-heading font-bold text-sm">
                  {step.step}
                </div>
                
                {/* Icon with animated background */}
                <div className="relative mb-6">
                  <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-brand-primary-100 to-brand-secondary-100 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <h3 className="font-heading text-xl font-bold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
                  {step.title}
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
                  {step.description}
                </p>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>

              {/* Connection Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg 
                    className="w-8 h-8 text-brand-primary-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 rounded-2xl border border-brand-primary-200 dark:border-brand-primary-700">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white rounded-full flex items-center justify-center font-heading font-bold mb-2">
                M
              </div>
              <span className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Manager</span>
            </div>
            
            <svg className="w-6 h-6 text-brand-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 text-white rounded-full flex items-center justify-center font-heading font-bold mb-2">
                L
              </div>
              <span className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Team Lead</span>
            </div>
            
            <svg className="w-6 h-6 text-brand-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white rounded-full flex items-center justify-center font-heading font-bold mb-2">
                T
              </div>
              <span className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Team Member</span>
            </div>
          </div>
          
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mt-4 max-w-2xl mx-auto">
            Our hierarchical workflow ensures quality control while maintaining efficiency and clear communication channels.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
