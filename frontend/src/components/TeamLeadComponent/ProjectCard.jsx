import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
const Navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
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
      <p className="text-gray-600 mt-2">{project.description}</p>
      <div className="flex items-center mt-3">
        {project.team.map((member, index) => (
          <img key={index} src={member} alt="Team Member" className="w-8 h-8 rounded-full border mx-1" />
        ))}
      </div>
      <div className="mt-3 text-gray-500 text-sm">
        📅 {project.dates}
      </div>
      <button className="w-full border border-blue-500 text-blue-500 px-4 py-2 rounded mt-3 hover:bg-blue-100"
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
