import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-xs mx-auto my-4 transform transition-transform duration-300 hover:scale-105">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <span className="text-sm">{project.status}</span>
      </div>

      {/* Progress */}
      <div className="p-4">
        <div className="mb-4">
          <span className="text-gray-600">Progress:</span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-width duration-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <span className="text-gray-600">Deadline:</span>
          <p className="text-gray-800">{project.deadline}</p>
        </div>

        {/* Budget */}
        <div className="mb-4">
          <span className="text-gray-600">Budget:</span>
          <p className="text-gray-800">${project.budget}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Last Updated: {project.lastUpdated}</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-300">
          View Details
        </button>
      </div>
    </div>
  );
}
