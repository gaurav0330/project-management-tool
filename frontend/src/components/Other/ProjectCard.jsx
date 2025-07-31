import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFolder,
  FaClock,
  FaArrowRight
} from "react-icons/fa";
import {jwtDecode} from "jwt-decode"; // fix import
import { motion } from "framer-motion";
import { useWindowSize } from "../../hooks/useWindowSize"; // Adjust path as needed

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

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

  // Date formatting function enhanced
  const formatDate = (dateInput) => {
    try {
      let date;

      if (typeof dateInput === "string") {
        if (dateInput.includes("T") || dateInput.includes("-")) {
          date = new Date(dateInput);
        } else {
          const timestamp = parseInt(dateInput);
          date = new Date(timestamp);
        }
      } else if (typeof dateInput === "number") {
        const timestamp =
          dateInput.toString().length === 10 ? dateInput * 1000 : dateInput;
        date = new Date(timestamp);
      } else {
        date = new Date(dateInput);
      }

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const handleNavigation = () => {
    if (role === "Team_Lead") {
      navigate(`/teamLead/project/${project.id}`);
    } else if (role === "Project_Manager") {
      navigate(`/projectHome/${project.id}`);
    } else if (role === "Team_Member") {
      navigate(`/teamMember/project/${project.id}`);
    }
  };

  // Responsive classes - adjust layout for small screens
  const containerClasses =
    "rounded-3xl p-6 lg:p-8 shadow-xl bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 hover:shadow-2xl group transition-all duration-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: width >= 768 ? 1.02 : 1 }} // Hover scale on md and up only
      transition={{ duration: 0.4 }}
      className={containerClasses}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-1 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-3">
            {project.description}
          </p>
        </div>
        {project.category && (
          <div className="shrink-0 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
            <FaFolder size={14} aria-hidden="true" />
            <span>{project.category}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body text-txt-primary-light dark:text-txt-primary-dark mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-500" aria-hidden="true" />
          <span>
            <strong>Start:</strong> {formatDate(project.startDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-red-500" aria-hidden="true" />
          <span>
            <strong>End:</strong> {formatDate(project.endDate)}
          </span>
        </div>
      </div>

      <button
        onClick={handleNavigation}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-white font-button font-medium text-sm rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 transition-all shadow-md hover:shadow-lg"
        aria-label={`View details of project ${project.title}`}
      >
        View Project
        <FaArrowRight size={14} aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default ProjectCard;
