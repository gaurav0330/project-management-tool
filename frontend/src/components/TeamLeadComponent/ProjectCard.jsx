import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
const Navigate = useNavigate();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span
          className={`px-2 py-1 text-sm font-medium rounded ${
            project.status === "Active" ? "bg-green-100 text-green-700" :
            project.status === "On Hold" ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-200 text-gray-700"
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="mt-2 text-gray-600">{project.description}</p>
      <div className="flex items-center mt-3">
        {project.team.map((member, index) => (
          <img key={index} src={member} alt="Team Member" className="w-8 h-8 mx-1 border rounded-full" />
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-500">
        📅 {project.dates}
      </div>
      <button className="w-full px-4 py-2 mt-3 text-blue-500 border border-blue-500 rounded hover:bg-blue-100"
      onClick={()=>{
        Navigate('/teamleadteamtask');
      }}
      >
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
