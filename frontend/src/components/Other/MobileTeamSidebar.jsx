import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  House,
  UsersFour,
  ClipboardText,
  ListChecks,
  ChartBar,
  UserPlus,
  ArrowsLeftRight,
  CaretDown,
  CaretUp,
  X,
} from "phosphor-react";
import { cn } from "../../../lib/utils";

const TEAM_MENU = [
  {
    title: "Project Overview",
    icon: House,
    items: [
      { label: "Project Home", icon: House, component: "projectHome" },
    ],
  },
  {
    title: "Task Management",
    icon: ClipboardText,
    items: [
      { label: "Create Tasks", icon: ClipboardText, component: "createtasks" },
      { label: "Manage Tasks", icon: ListChecks, component: "managetasks" },
      { label: "Approve Tasks", icon: ChartBar, component: "approvetasks" },
    ],
  },
  {
    title: "Team & Reports",
    icon: UsersFour,
    items: [
      { label: "Add Members", icon: UserPlus, component: "addmembers" },
      { label: "Task Distribution", icon: ArrowsLeftRight, component: "taskDistribution" }
    ],
  },
];

const MobileTeamSidebar = ({ 
  setActiveComponent, 
  activeComponent, 
  onClose,
  teamId,
  projectId
}) => {
  const [activeItem, setActiveItem] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  // Auto-expand sections when component loads
  useEffect(() => {
    const initialExpanded = {};
    TEAM_MENU.forEach(section => {
      initialExpanded[section.title] = true; // Auto-expand all sections on mobile
    });
    setExpandedSections(initialExpanded);
  }, []);

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleItemClick = (comp, txt) => {
    setActiveComponent(comp);
    setActiveItem(txt);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary-light dark:bg-bg-secondary-dark">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/20 dark:border-gray-700/20 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <House className="w-3.5 h-3.5 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="font-heading text-base font-semibold text-heading-primary-light dark:text-heading-primary-dark tracking-tight">
              Team Dashboard
            </h1>
            <p className="text-xs text-brand-primary-600 dark:text-brand-primary-400 font-medium">
              Team Management Hub
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-txt-primary-light dark:text-txt-primary-dark" />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {TEAM_MENU.map(({ title, icon: SectionIcon, items }, i) => (
          <motion.div 
            key={i} 
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Section Header - Clickable */}
            <button
              onClick={() => toggleSection(title)}
              className={cn(
                "w-full justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center",
                "bg-bg-primary-light dark:bg-bg-primary-dark",
                "hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark",
                "text-txt-primary-light dark:text-txt-primary-dark",
                "border border-gray-200/20 dark:border-gray-700/20"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-brand-primary-50 dark:bg-brand-primary-900/20 flex items-center justify-center">
                  <SectionIcon className="w-3.5 h-3.5 text-brand-primary-600 dark:text-brand-primary-400" weight="duotone" />
                </div>
                <span className="font-medium tracking-wide uppercase">{title}</span>
              </div>
              {expandedSections[title] ? (
                <CaretUp className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              ) : (
                <CaretDown className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              )}
            </button>

            {/* Collapsible Links */}
            {expandedSections[title] && (
              <motion.div 
                className="ml-3 space-y-1 border-l border-gray-300/30 dark:border-gray-600/30 pl-3 py-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {items.map(({ label, icon: Icon, component }, linkIndex) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: linkIndex * 0.05 }}
                    onClick={() => handleItemClick(component, label)}
                    className={cn(
                      "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300 flex items-center",
                      activeItem === label
                        ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                        : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" weight="duotone" />
                    <span className="font-medium tracking-wide">{label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Separator */}
            {i !== TEAM_MENU.length - 1 && (
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
            )}
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200/10 dark:border-gray-700/10 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            <UsersFour className="w-3.5 h-3.5 text-white" weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-txt-primary-light dark:text-txt-primary-dark truncate tracking-wide">
              Team Management
            </p>
            <p className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark font-medium">
              Active Team
            </p>
          </div>
          <div className="text-right">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTeamSidebar;
