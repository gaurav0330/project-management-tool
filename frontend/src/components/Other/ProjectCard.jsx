import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFolder, FaClock, FaArrowRight, FaStar } from "react-icons/fa";
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
      className="relative p-8 transition-transform duration-300 bg-white shadow-xl rounded-3xl hover:shadow-2xl hover:scale-105"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title & Category */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
        {project.category && (
          <span className="flex items-center gap-2 px-4 py-2 text-lg font-semibold text-blue-700 bg-blue-200 rounded-full">
            <FaFolder className="text-blue-600" />
            {project.category}
          </span>
        )}
      </div>

      {/* Project Description */}
      <p className="mt-4 text-lg text-gray-700 line-clamp-3">{project.description}</p>

      {/* Date Section */}
      <div className="mt-6 space-y-3 text-base text-gray-700">
        <p className="flex items-center gap-3">
          <FaCalendarAlt className="text-green-600" />
          <span className="font-semibold">Start Date:</span> {project.startDate.split("T")[0]}
        </p>
        <p className="flex items-center gap-3">
          <FaClock className="text-red-600" />
          <span className="font-semibold">End Date:</span> {project.endDate.split("T")[0]}  
        </p>
        <p className="flex items-center gap-3">
          <FaStar className="text-yellow-500" />
          <span className="font-semibold">Priority:</span> {project.priority || 'Normal'}
        </p>
      </div>

      {/* View Project Button */}
      <button
        onClick={handleNavigation}
        className="flex items-center justify-center w-full px-6 py-3 mt-8 text-lg font-bold text-white transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-700"
      >
        View Project <FaArrowRight className="ml-3" />
      </button>

      {/* Decorative Border at Bottom */}
      </motion.div>
  );
};

export default ProjectCard;
