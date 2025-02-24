import React from 'react';

const ProjectDetails = ({ projectName, setProjectName, projectDescription, setProjectDescription }) => {
  return (
    <>
      <div>
        <label className="block text-gray-700">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter project name"
        />
      </div>
      <div>
        <label className="block text-gray-700">Project Description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Describe your project"
        ></textarea>
      </div>
    </>
  );
};

export default ProjectDetails;
