import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFolder, FaClock, FaArrowRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Ensure you installed it: npm install jwt-decode

const ProjectCard = ({ project }) => {
  const navigate = useNavigate(); // ✅ useNavigate Hook for navigation

  // ✅ Extract role from token
  let role = null;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; // Ensure your backend sends 'role' in the JWT
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  // ✅ Handle navigation dynamically
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
    <div className="relative p-6 transition-transform duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105">
      {/* Title & Category */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
        {project.category && (
          <span className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            <FaFolder className="text-blue-600" />
            {project.category}
          </span>
        )}
      </div>

      {/* Project Description */}
      <p className="mt-3 text-sm text-gray-600 line-clamp-2">{project.description}</p>

      {/* Date Section */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-600" />
          <span className="font-medium">Start Date:</span> {project.startDate}
        </p>
        <p className="flex items-center gap-2">
          <FaClock className="text-red-600" />
          <span className="font-medium">End Date:</span> {project.endDate}
        </p>
      </div>

      {/* View Project Button */}
      <button
        onClick={handleNavigation}
        className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
      >
        View Project <FaArrowRight className="ml-2" />
      </button>

      {/* Decorative Border at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg bg-gradient-to-r from-blue-400 to-purple-500"></div>
    </div>
  );
};

export default ProjectCard;
