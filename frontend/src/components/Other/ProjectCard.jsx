import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFolder,
  FaClock,
  FaArrowRight
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useResponsive } from "../../hooks/useResponsive";

// ✅ Status style mapping
const statusStyles = {
  "In Progress": {
    bg: "bg-orange-100 dark:bg-orange-900/20",
    text: "text-orange-800 dark:text-orange-300",
    icon: "🚀",
  },
  Completed: {
    bg: "bg-green-100 dark:bg-green-900/20",
    text: "text-green-800 dark:text-green-300",
    icon: "✅",
  },
  "On Hold": {
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-300",
    icon: "⏸️",
  },
  Cancelled: {
    bg: "bg-red-100 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-300",
    icon: "❌",
  },
  Delayed: {
    bg: "bg-purple-100 dark:bg-purple-900/20",
    text: "text-purple-800 dark:text-purple-300",
    icon: "⏳",
  },
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-400",
    icon: "❓",
  },
};

const ProjectCard = ({ project, viewMode = "grid", className = "" }) => {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  // ✅ Get role from JWT
  let role = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  // ✅ Format date with better mobile handling
  const formatDate = (dateInput) => {
    try {
      let date;

      if (typeof dateInput === "string") {
        date = dateInput.includes("T") ? new Date(dateInput) : new Date(parseInt(dateInput));
      } else if (typeof dateInput === "number") {
        date = new Date(dateInput.toString().length === 10 ? dateInput * 1000 : dateInput);
      } else {
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) return "Invalid Date";

      // Use shorter format for mobile
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: isMobile ? "short" : "2-digit",
        year: isMobile ? "2-digit" : "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleNavigation = () => {
    if (role === "Team_Lead") navigate(`/teamLead/project/${project.id}`);
    else if (role === "Project_Manager") navigate(`/projectHome/${project.id}`);
    else if (role === "Team_Member") navigate(`/teamMember/project/${project.id}`);
  };

  const style = statusStyles[project.status] || statusStyles.default;

  // Responsive configurations
  const getResponsiveConfig = () => {
    if (isMobile) {
      return {
        containerPadding: "p-4",
        borderRadius: "rounded-2xl",
        titleSize: "text-lg",
        descriptionSize: "text-sm",
        metaTextSize: "text-xs",
        buttonPadding: "px-4 py-2.5",
        buttonTextSize: "text-sm",
        iconSize: 12,
        hoverScale: 1,
        gridConfig: "grid-cols-1",
        gap: "gap-3"
      };
    } else if (isTablet) {
      return {
        containerPadding: "p-5",
        borderRadius: "rounded-2xl",
        titleSize: "text-xl",
        descriptionSize: "text-sm",
        metaTextSize: "text-sm",
        buttonPadding: "px-4 py-3",
        buttonTextSize: "text-sm",
        iconSize: 14,
        hoverScale: 1.01,
        gridConfig: "grid-cols-1 sm:grid-cols-2",
        gap: "gap-4"
      };
    } else {
      return {
        containerPadding: "p-6 lg:p-8",
        borderRadius: "rounded-3xl",
        titleSize: "text-xl",
        descriptionSize: "text-sm",
        metaTextSize: "text-sm",
        buttonPadding: "px-5 py-3",
        buttonTextSize: "text-sm",
        iconSize: 14,
        hoverScale: 1.02,
        gridConfig: "grid-cols-1 sm:grid-cols-2",
        gap: "gap-4"
      };
    }
  };

  const config = getResponsiveConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: config.hoverScale }}
      transition={{ duration: 0.4 }}
      className={`
        ${config.borderRadius} ${config.containerPadding} 
        shadow-xl bg-bg-primary-light dark:bg-bg-primary-dark 
        border border-gray-200 dark:border-gray-700 
        hover:shadow-2xl group transition-all duration-300
        w-full max-w-full overflow-hidden
        ${className}
      `}
    >
      {/* Header Section */}
      <div className={`flex flex-col ${isMobile ? 'gap-3' : 'sm:flex-row sm:items-start sm:justify-between'} mb-4 ${isMobile ? '' : 'sm:gap-0'}`}>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className={`
            ${config.titleSize} font-heading font-bold 
            text-heading-primary-light dark:text-heading-primary-dark 
            mb-1 line-clamp-2 break-words
          `}>
            {project.title}
          </h3>
          <p className={`
            ${config.descriptionSize} text-txt-secondary-light dark:text-txt-secondary-dark 
            line-clamp-3 break-words
          `}>
            {project.description}
          </p>
        </div>

        {/* Category Badge */}
        {project.category && (
          <div className={`
            ${isMobile ? 'self-start' : 'shrink-0'} 
            px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 
            rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-semibold 
            flex items-center gap-1 whitespace-nowrap max-w-full
          `}>
            <FaFolder size={isMobile ? 10 : 12} aria-hidden="true" />
            <span className="truncate">{project.category}</span>
          </div>
        )}
      </div>

      {/* Project Details Grid */}
      <div className={`
        grid ${config.gridConfig} ${config.gap} 
        ${config.metaTextSize} font-body 
        text-txt-primary-light dark:text-txt-primary-dark 
        mb-4
      `}>
        {/* Start Date */}
        <div className="flex items-center gap-2 min-w-0">
          <FaCalendarAlt className="text-green-500 flex-shrink-0" size={config.iconSize} aria-hidden="true" />
          <span className="truncate">
            <strong className="font-semibold">Start:</strong> {formatDate(project.startDate)}
          </span>
        </div>

        {/* End Date */}
        <div className="flex items-center gap-2 min-w-0">
          <FaClock className="text-red-500 flex-shrink-0" size={config.iconSize} aria-hidden="true" />
          <span className="truncate">
            <strong className="font-semibold">End:</strong> {formatDate(project.endDate)}
          </span>
        </div>

        {/* Status Badge - Full width on mobile, spanning 2 columns on larger screens */}
        <div className={`${isMobile ? 'col-span-1' : 'col-span-1 sm:col-span-2'} flex ${isMobile ? 'justify-start' : 'justify-center sm:justify-start'}`}>
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full 
              ${isMobile ? 'text-xs' : 'text-sm'} font-semibold select-none 
              ${style.bg} ${style.text} max-w-full
            `}
            aria-label={`Project status: ${project.status}`}
            title={`Status: ${project.status}`}
          >
            <span className="whitespace-nowrap">Status:</span> 
            <span className="flex-shrink-0">{style.icon}</span> 
            <span className="truncate">{project.status}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNavigation}
        className={`
          w-full flex items-center justify-center gap-2 
          ${config.buttonPadding} text-white font-button font-medium 
          ${config.buttonTextSize} rounded-full 
          bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 
          hover:from-brand-primary-600 hover:to-brand-secondary-600 
          transition-all shadow-md hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-brand-primary-500/50
        `}
        aria-label={`View details of project ${project.title}`}
      >
        <span>View Project</span>
        <FaArrowRight size={config.iconSize} aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default ProjectCard;
