import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const HowItWorksSection = () => {
  const { isDark } = useTheme();
  const [activeWorkflow, setActiveWorkflow] = useState('manager');
  
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

  const workflows = {
    manager: {
      title: "Project Manager",
      avatar: "👨‍💼",
      color: "brand-primary",
      description: "Strategic oversight and project direction",
      steps: [
        {
          title: "Project Initiation",
          description: "Define project vision, scope, and objectives with stakeholders",
          icon: "🚀",
          time: "Day 1-2",
          status: "Planning"
        },
        {
          title: "Domain Architecture",
          description: "Identify technical domains, define requirements and dependencies",
          icon: "🏗️",
          time: "Day 3-4",
          status: "Design"
        },
        {
          title: "Team Lead Selection",
          description: "Assign experienced domain leads and establish communication channels",
          icon: "🎯",
          time: "Day 5-7",
          status: "Setup"
        },
        {
          title: "Monitor & Approve",
          description: "Review team outputs, provide feedback, and grant final approvals",
          icon: "✅",
          time: "Ongoing",
          status: "Active"
        }
      ]
    },
    lead: {
      title: "Team Lead",
      avatar: "👩‍💻",
      color: "brand-secondary",
      description: "Domain expertise and team coordination",
      steps: [
        {
          title: "Requirements Analysis",
          description: "Break down domain requirements into actionable development tasks",
          icon: "📋",
          time: "Day 1-3",
          status: "Analysis"
        },
        {
          title: "Team Assembly",
          description: "Form specialized teams, assign roles, and establish workflows",
          icon: "👥",
          time: "Day 4-5",
          status: "Formation"
        },
        {
          title: "Code Review & Guidance",
          description: "Review submissions, provide technical guidance, and ensure quality",
          icon: "🔍",
          time: "Daily",
          status: "Review"
        },
        {
          title: "Integration & Delivery",
          description: "Compile domain deliverables and submit to project manager",
          icon: "📦",
          time: "Sprint End",
          status: "Delivery"
        }
      ]
    },
    member: {
      title: "Team Member",
      avatar: "👨‍💻",
      color: "brand-accent",
      description: "Implementation and development focus",
      steps: [
        {
          title: "Task Assignment",
          description: "Receive detailed tasks with requirements, deadlines, and acceptance criteria",
          icon: "📝",
          time: "Sprint Start",
          status: "Assigned"
        },
        {
          title: "Development Sprint",
          description: "Code implementation, testing, and collaboration with team members",
          icon: "⚙️",
          time: "Daily",
          status: "Development"
        },
        {
          title: "Progress Reporting",
          description: "Update task status, log time, and communicate any blockers",
          icon: "📊",
          time: "Daily",
          status: "Tracking"
        },
        {
          title: "Submission & Review",
          description: "Submit completed work for lead review and incorporate feedback",
          icon: "✨",
          time: "Task Complete",
          status: "Complete"
        }
      ]
    }
  };

  const WorkflowCard = ({ workflowKey, workflow, isActive }) => {
    return (
      <motion.button 
        onClick={() => setActiveWorkflow(workflowKey)}
        className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
          isActive
            ? `bg-gradient-to-br from-${workflow.color}-500 to-${workflow.color}-600 text-white shadow-2xl scale-105`
            : 'card hover:shadow-2xl hover:-translate-y-1'
        }`}
        whileHover={{ scale: isActive ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${isActive ? 'bg-white/10' : `bg-${workflow.color}-100 dark:bg-${workflow.color}-900/20`} rounded-full -translate-y-12 translate-x-12`}></div>
        
        <div className="relative z-10 " >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">{workflow.avatar}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isActive 
                ? 'bg-white/20 text-white' 
                : `bg-${workflow.color}-100 text-${workflow.color}-700 dark:bg-${workflow.color}-900/30 dark:text-${workflow.color}-300`
            }`}>
              {workflow.steps.length} Steps
            </span>
          </div>
          
          <h3 className={`font-heading text-xl font-bold mb-2 ${
            isActive ? 'text-white' : 'text-heading-primary-light dark:text-heading-primary-dark'
          }`}>
            {workflow.title}
          </h3>
          
          <p className={`font-body text-sm ${
            isActive ? 'text-white/80' : 'text-txt-secondary-light dark:text-txt-secondary-dark'
          }`}>
            {workflow.description}
          </p>
          
          {isActive && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      </motion.button>
    );
  };

  const StepCard = ({ step, index, workflow }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="card group hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
      >
        {/* Animated border */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-${workflow.color}-400 to-${workflow.color}-600 group-hover:w-2 transition-all duration-300`}></div>
        
        {/* Step indicator */}
        <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-${workflow.color}-500 to-${workflow.color}-600 text-white rounded-full flex items-center justify-center font-heading font-bold text-sm shadow-lg`}>
          {index + 1}
        </div>
        
        <div className="pl-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-2xl p-3 rounded-xl bg-gradient-to-r from-${workflow.color}-100 to-${workflow.color}-200 dark:from-${workflow.color}-900/20 dark:to-${workflow.color}-800/20`}>
              {step.icon}
            </div>
            <div>
              <span className={`text-xs px-2 py-1 rounded-full bg-${workflow.color}-100 text-${workflow.color}-700 dark:bg-${workflow.color}-900/30 dark:text-${workflow.color}-300 font-medium`}>
                {step.time}
              </span>
              <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ml-2 bg-gradient-to-r from-${workflow.color}-500 to-${workflow.color}-600 text-white font-medium`}>
                {step.status}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <h4 className={`font-heading text-lg font-bold mb-2 text-heading-primary-light dark:text-heading-primary-dark group-hover:text-${workflow.color}-600 transition-colors`}>
            {step.title}
          </h4>
          
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm leading-relaxed">
            {step.description}
          </p>
        </div>
        
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-${workflow.color}-500/5 to-${workflow.color}-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </motion.div>
    );
  };

  return (
    <section className="section-padding bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      <div className="section-container">
        {/* Header */}
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

        {/* Original Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card text-center h-full hover:shadow-2xl transform hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white rounded-full flex items-center justify-center font-heading font-bold text-sm">
                  {step.step}
                </div>
                
                <div className="relative mb-6">
                  <div className="text-6xl mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300 float-animation">
                    {step.icon}
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-brand-primary-100 to-brand-secondary-100 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="font-heading text-xl font-bold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
                  {step.title}
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
                  {step.description}
                </p>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg className="w-8 h-8 text-brand-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Workflow Deep Dive */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-heading-primary-light dark:text-heading-primary-dark">
            Role-Specific Workflows
          </h3>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-2xl mx-auto">
            Dive deep into how each role contributes to successful project delivery
          </p>
        </motion.div>

        {/* Workflow Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {Object.entries(workflows).map(([key, workflow]) => (
            <WorkflowCard
              key={key}
              workflowKey={key}
              workflow={workflow}
              isActive={activeWorkflow === key}
            />
          ))}
        </div>

        {/* Active Workflow Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorkflow}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Workflow Header */}
            <div className={`glass p-8 mb-8 bg-gradient-to-r from-${workflows[activeWorkflow].color}-500/10 to-${workflows[activeWorkflow].color}-600/10 border border-${workflows[activeWorkflow].color}-200 dark:border-${workflows[activeWorkflow].color}-800`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{workflows[activeWorkflow].avatar}</div>
                  <div>
                    <h3 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                      {workflows[activeWorkflow].title} Workflow
                    </h3>
                    <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mt-2">
                      {workflows[activeWorkflow].description}
                    </p>
                  </div>
                </div>
                <div className={`text-4xl opacity-20 text-${workflows[activeWorkflow].color}-500`}>
                  🔄
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflows[activeWorkflow].steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={step}
                  index={index}
                  workflow={workflows[activeWorkflow]}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Process Flow Visualization */}
        <motion.div
  className="mt-20 text-center px-4"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.5 }}
  viewport={{ once: true }}
>
  <div className="glass flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-6 md:space-y-0 p-6 md:p-8 bg-gradient-to-r from-brand-primary-50/50 to-brand-secondary-50/50 dark:from-brand-primary-900/10 dark:to-brand-secondary-900/10 border border-brand-primary-200 dark:border-brand-primary-800 rounded-xl max-w-4xl mx-auto">
    
    {/* Manager */}
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white rounded-2xl flex items-center justify-center font-heading font-bold text-xl mb-3 shadow-lg mx-auto">
        M
      </div>
      <span className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">Manager</span>
    </div>

    {/* Arrow */}
    <svg className="w-6 h-6 md:w-8 md:h-8 text-brand-primary-500 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>

    {/* Team Lead */}
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 text-white rounded-2xl flex items-center justify-center font-heading font-bold text-xl mb-3 shadow-lg mx-auto">
        L
      </div>
      <span className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">Team Lead</span>
    </div>

    {/* Arrow */}
    <svg className="w-6 h-6 md:w-8 md:h-8 text-brand-primary-500 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>

    {/* Team Member */}
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 text-white rounded-2xl flex items-center justify-center font-heading font-bold text-xl mb-3 shadow-lg mx-auto">
        T
      </div>
      <span className="font-body text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">Team Member</span>
    </div>
  </div>

  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mt-6 max-w-2xl mx-auto px-2">
    Our hierarchical workflow ensures quality control while maintaining efficiency and clear communication channels throughout the entire development lifecycle.
  </p>
</motion.div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
