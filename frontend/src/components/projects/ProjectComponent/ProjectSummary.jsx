import React from 'react';

const ProjectSummary = ({ projectName, category, startDate, endDate, teamLead }) => {
  return (
    <div className="p-4 mt-6 bg-gray-100 rounded-lg">
      <h3 className="mb-2 text-lg font-semibold">Project Summary</h3>
      <p><strong>Project Name:</strong> {projectName}</p>
      <p><strong>Category:</strong> {category}</p>
      <p>
        <strong>Duration:</strong> {startDate} - {endDate}
      </p>
      <p>
        <strong>Team Lead:</strong> {teamLead}
      </p>
    </div>
  );
};

export default ProjectSummary;
