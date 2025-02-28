import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
      {/* Title & Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            project.status === "Active" ? "bg-green-100 text-green-700" :
            project.status === "On Hold" ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-200 text-gray-700"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-gray-600">{project.description}</p>

      {/* Team Members */}
      <div className="flex items-center mt-4">
        {project.members.map((member, index) => (
          <div key={index} className="flex items-center justify-center w-8 h-8 -ml-2 text-sm font-semibold text-white bg-blue-500 border-2 border-white rounded-full first:ml-0">
            {member[0]}
          </div>
        ))}
      </div>

      {/* Start & End Dates */}
      <div className="mt-3 text-sm text-gray-500">
        📅 {project.startDate} - {project.endDate}
      </div>
    </div>
  );
};

export default ProjectCard;
