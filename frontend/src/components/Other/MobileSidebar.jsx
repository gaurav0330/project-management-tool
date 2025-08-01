import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home, FolderKanban, Users, BarChart3, Settings, ChevronDown, ChevronRight,
  UserCog, ClipboardList, UserPlus, Target, CheckCircle,
  TrendingUp, Github, Calendar, Shield, Briefcase, User, Database, MessageSquare, X
} from "lucide-react";
import { cn } from "../../../lib/utils";

const MobileSidebar = ({ 
  setActiveComponent, 
  category, 
  activeComponent, 
  onClose 
}) => {
  const [userRole, setUserRole] = useState(null);
  const [activeItem, setActiveItem] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.role) setUserRole(stored.role);
  }, []);

  // Auto-expand sections when component loads
  useEffect(() => {
    if (userRole) {
      const sections = MENU[userRole] || [];
      const initialExpanded = {};
      sections.forEach(section => {
        initialExpanded[section.title] = true; // Auto-expand all sections on mobile
      });
      setExpandedSections(initialExpanded);
    }
  }, [userRole]);

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Role-based menu structure optimized for Team Lead
  const MENU = {
    Project_Manager: [
      {
        title: "Project Management",
        icon: FolderKanban,
        links: [
          { txt: "Project Home", icon: Briefcase, comp: "projectHome" },
          ...(category === "development" ? [{ txt: "Integrations", icon: Github, comp: "integrations" }] : []),
          { txt: "Manage Lead", icon: UserCog, comp: "managelead" },
          { txt: "Manage Tasks", icon: ClipboardList, comp: "assignedTasks" },
          { txt: "Manage Team", icon: Users, comp: "manageteam" },
          { txt: "Approve Tasks", icon: CheckCircle, comp: "approvetask" },
        ],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Analytics & Reports",
        icon: BarChart3,
        links: [
          { txt: "Timeline", icon: Calendar, comp: "TimeLine" },
          { txt: "Analytics", icon: TrendingUp, comp: "analytics" },
        ],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "setting" }],
      },
    ],
    Team_Lead: [
      {
        title: "Overview",
        icon: Home,
        links: [{ txt: "Project Home", icon: Briefcase, comp: "projectHome" }],
      },
      {
        title: "My Tasks",
        icon: ClipboardList,
        links: [
          { txt: "My Tasks", icon: Target, comp: "mytasks" },
          { txt: "Task Submit", icon: CheckCircle, comp: "approvetask" },
        ],
      },
      {
        title: "Team Management",
        icon: Users,
        links: [
          { txt: "Create Team", icon: UserPlus, comp: "createteam" },
          { txt: "My Teams", icon: Users, comp: "myteams" },
        ],
      },
      {
        title: "Task Operations",
        icon: CheckCircle,
        links: [
          { txt: "Assign Tasks", icon: ClipboardList, comp: "tasks" },
          { txt: "View Tasks", icon: Target, comp: "assignedTasks" },
        ],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "setting" }],
      },
    ],
    Team_Member: [
      {
        title: "Overview",
        icon: Home,
        links: [{ txt: "Dashboard", icon: Database, comp: "overview" }],
      },
      {
        title: "My Tasks",
        icon: ClipboardList,
        links: [{ txt: "My Tasks", icon: Target, comp: "tasks" }],
      },
      {
        title: "Chat & Collaboration",
        icon: MessageSquare,
        links: [{ txt: "Chat", icon: MessageSquare, comp: "chat" }],
      },
      {
        title: "Project Settings",
        icon: Settings,
        links: [{ txt: "Settings", icon: Shield, comp: "settings" }],
      },
    ],
  };

  const sections = MENU[userRole] || [];

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
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-base font-semibold text-heading-primary-light dark:text-heading-primary-dark tracking-tight">
              YojanaDesk
            </h1>
            {userRole === "Team_Lead" && (
              <p className="text-xs text-brand-primary-600 dark:text-brand-primary-400 font-medium">
                Leadership Hub
              </p>
            )}
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
        {sections.map(({ title, icon: SectionIcon, links }, i) => (
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
                "border border-gray-200/20 dark:border-gray-700/20",
                userRole === "Team_Lead" && title === "Team Management" 
                  ? "ring-2 ring-brand-primary-500/20 bg-brand-primary-50/50 dark:bg-brand-primary-900/10" 
                  : ""
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center",
                  userRole === "Team_Lead" && title === "Team Management"
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-primary-50 dark:bg-brand-primary-900/20"
                )}>
                  <SectionIcon className={cn(
                    "w-3.5 h-3.5",
                    userRole === "Team_Lead" && title === "Team Management"
                      ? "text-white"
                      : "text-brand-primary-600 dark:text-brand-primary-400"
                  )} />
                </div>
                <span className="font-medium tracking-wide uppercase">{title}</span>
              </div>
              {expandedSections[title] ? (
                <ChevronDown className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-txt-secondary-light dark:text-txt-secondary-dark" />
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
                {links.map(({ txt, icon: Icon, comp }, linkIndex) => (
                  <motion.button
                    key={txt}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: linkIndex * 0.05 }}
                    onClick={() => handleItemClick(comp, txt)}
                    className={cn(
                      "w-full justify-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300 flex items-center",
                      activeItem === txt
                        ? "bg-brand-primary-600 text-white shadow-lg font-medium"
                        : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium tracking-wide">{txt}</span>
                    {userRole === "Team_Lead" && (txt === "Create Team" || txt === "My Teams") && (
                      <div className="ml-auto w-2 h-2 bg-brand-primary-500 rounded-full animate-pulse"></div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Separator */}
            {i !== sections.length - 1 && (
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-300/20 dark:via-gray-600/20 to-transparent" />
            )}
          </motion.div>
        ))}

        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mb-3">
              <Settings className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            </div>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark font-medium">Loading menu...</p>
          </div>
        )}
      </nav>

      {/* Enhanced Footer for Team Lead */}
      <div className="p-3 border-t border-gray-200/10 dark:border-gray-700/10 bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200/20 dark:border-gray-700/20 transition-all duration-300">
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shadow-sm flex-shrink-0",
            userRole === "Team_Lead" 
              ? "bg-gradient-to-br from-yellow-500 to-orange-500"
              : "bg-gradient-to-br from-brand-accent-500 to-brand-accent-600"
          )}>
            {userRole === "Team_Lead" ? (
              <Target className="w-3.5 h-3.5 text-white" />
            ) : (
              <User className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-txt-primary-light dark:text-txt-primary-dark truncate tracking-wide">
              {userRole?.replace("_", " ") || "User"}
            </p>
            <p className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark font-medium">
              {userRole === "Team_Lead" ? "Leading Teams" : "Online"}
            </p>
          </div>
          {userRole === "Team_Lead" && (
            <div className="text-right">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
