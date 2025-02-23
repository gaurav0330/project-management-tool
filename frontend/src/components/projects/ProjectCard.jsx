import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="w-full max-w-xs mx-auto my-4 bg-white rounded-2xl border border-gray-300 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-200 to-green-200 text-gray-800 rounded-t-2xl">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <span className="text-sm">{project.status}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress */}
        <div className="mb-2">
          <span className="text-gray-600">Progress:</span>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-1 overflow-hidden">
            <div
              className="bg-blue-400 h-2 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Deadline */}
        <div className="mb-2">
          <span className="text-gray-600">Deadline:</span>
          <p className="text-gray-800">{project.deadline}</p>
        </div>

        {/* Budget */}
        <div className="mb-2">
          <span className="text-gray-600">Budget:</span>
          <p className="text-gray-800">${project.budget}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-b-2xl">
        <span className="text-xs text-gray-600">Last Updated: {project.lastUpdated}</span>
        <button className="px-2 py-1 text-white bg-blue-500 rounded-md text-xs hover:bg-blue-600">
          View Details
        </button>
      </div>
    </div>
  );
}
