import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const UseCasesSection = () => {
  const { isDark } = useTheme();

  const useCases = [
    {
      title: 'Software Development Teams',
      description: 'Perfect for full-stack development with separate frontend, backend, and DevOps teams',
      icon: '💻',
      example: 'Web applications, mobile apps, SaaS products'
    },
    {
      title: 'Enterprise Projects',
      description: 'Large-scale projects requiring multiple specialized teams and strict approval workflows',
      icon: '🏢',
      example: 'ERP systems, enterprise platforms, multi-tenant applications'
    },
    {
      title: 'Startup MVP Development',
      description: 'Fast-paced development with clear task delegation and progress tracking',
      icon: '🚀',
      example: 'MVP development, prototype creation, rapid iterations'
    },
    {
      title: 'Remote Development Teams',
      description: 'Distributed teams need structured communication and clear task ownership',
      icon: '🌍',
      example: 'Global teams, remote collaboration, async workflows'
    }
  ];

  return (
    <section className="section-padding py-16 bg-bg-primary-light dark:bg-bg-primary-dark transition-colors duration-300">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-heading-primary-light dark:text-heading-primary-dark">
            Perfect For Your Team
          </h2>
          <p className="font-body text-xl text-txt-secondary-light dark:text-txt-secondary-dark max-w-2xl mx-auto">
            Built for every stage and size of modern software development teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="card group hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{useCase.icon}</div>
                <div>
                  <h3 className="font-heading text-xl font-semibold mb-2 text-heading-primary-light dark:text-heading-primary-dark">
                    {useCase.title}
                  </h3>
                  <p className="font-body text-txt-primary-light dark:text-txt-primary-dark mb-2">
                    {useCase.description}
                  </p>
                  <p className="font-body text-sm italic text-txt-secondary-light dark:text-txt-secondary-dark">
                    Examples: {useCase.example}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
