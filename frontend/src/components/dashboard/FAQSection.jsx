import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';

const FAQSection = () => {
  const { isDark } = useTheme();
  
  const faqs = [
    {
      question: 'How is YojanaDesk different from other project management tools?',
      answer: 'YojanaDesk is specifically designed for software development with domain-based team structure, built-in approval workflows, and role-based access control.'
    },
    {
      question: 'Can I customize the approval workflow?',
      answer: 'Yes! You can configure different approval flows for different types of tasks and projects based on your team\'s needs.'
    },
    {
      question: 'Is there a limit on team size?',
      answer: 'No limits! Scale from small startups to large enterprise teams with unlimited users and projects.'
    },
    {
      question: 'Do you integrate with Git repositories?',
      answer: 'Yes, we offer Git integration to automatically update task status based on commits and pull requests.'
    },
    {
      question: 'Is there mobile support?',
      answer: 'Absolutely! YojanaDesk works seamlessly on mobile devices for on-the-go project management.'
    }
  ];

  return (
    <Box className="py-16 bg-bg-accent-light dark:bg-bg-accent-dark transition-colors duration-300">
      <Container maxWidth="md">
        <Typography variant="h2" className="text-center mb-12 font-bold text-heading-primary-light dark:text-heading-primary-dark">
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} className="mb-2 bg-bg-primary-light dark:bg-bg-primary-dark border-gray-200 dark:border-gray-700">
            <AccordionSummary 
              expandIcon={<span className="text-2xl text-brand-primary-500">▼</span>}
            >
              <Typography variant="h6" className="text-heading-primary-light dark:text-heading-primary-dark">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="text-txt-secondary-light dark:text-txt-secondary-dark">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};

export default FAQSection;
