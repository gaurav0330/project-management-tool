import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const TeamCard = ({ team, projectId, navigate }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-6 bg-white border border-gray-200 shadow-md cursor-pointer rounded-2xl hover:shadow-lg"
      onClick={() => navigate(`/teamlead/project/${projectId}/${team.id}`)}
    >
      {/* Team Name */}
      <h3 className="text-2xl font-semibold text-gray-900">{team.teamName}</h3>
      
      {/* Creation Date */}
      <p className="mt-1 text-sm text-gray-500">
        Created on {new Date(team.createdAt).toDateString()}
      </p>

      {/* Description */}
      <p className="mt-3 text-gray-700 line-clamp-2">{team.description}</p>

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-sm font-medium text-gray-500">+ Members</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaUserPlus className="text-lg" /> Invite
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TeamCard;
