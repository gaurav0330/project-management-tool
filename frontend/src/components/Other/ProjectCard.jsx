import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFolder,
  FaClock,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
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

  const handleNavigation = () => {
    if (role === "Team_Lead") {
      navigate(`/teamLead/project/${project.id}`);
    } else if (role === "Project_Manager") {
      navigate(`/projectHome/${project.id}`);
    } else if (role === "Team_Member") {
      navigate(`/teamMember/project/${project.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl p-6 lg:p-8 shadow-xl bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 hover:shadow-2xl group transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-1 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-2">
            {project.description}
          </p>
        </div>
        {project.category && (
          <div className="ml-2 shrink-0 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-semibold flex items-center gap-2">
            <FaFolder size={14} />
            {project.category}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body text-txt-primary-light dark:text-txt-primary-dark mb-6">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-500" />
          <span>
            <strong>Start:</strong> {project.startDate.split("T")[0]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-red-500" />
          <span>
            <strong>End:</strong> {project.endDate.split("T")[0]}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <FaStar className="text-yellow-500" />
          <span>
            <strong>Priority:</strong> {project.priority || "Normal"}
          </span>
        </div>
      </div>

      <button
        onClick={handleNavigation}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-white font-button font-medium text-sm rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 transition-all shadow-md hover:shadow-lg"
      >
        View Project
        <FaArrowRight size={14} />
      </button>
    </motion.div>
  );
};

export default ProjectCard;
