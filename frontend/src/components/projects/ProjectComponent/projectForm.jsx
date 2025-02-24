import React, { useState } from 'react';
import ProjectDetails from './ProjectDetails.jsx';
import ProjectDates from './ProjectDates.jsx';
import ProjectCategory from './ProjectCategory';
import TeamLeadSelection from './TeamLeadSelection.jsx';
import ProjectSummary from './ProjectSummary.jsx';

const ProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [teamLead, setTeamLead] = useState('');

  const teamLeads = [
    { id: 1, name: 'Sarah Johnson', role: 'Content Developer' },
    { id: 2, name: 'Mike Chen', role: 'Design Lead' },
    { id: 3, name: 'Emily Davis', role: 'Marketing Manager' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      projectName,
      projectDescription,
      startDate,
      endDate,
      category,
      teamLead,
    });
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProjectDetails
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
        />
        <ProjectDates
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <ProjectCategory category={category} setCategory={setCategory} />
        <TeamLeadSelection teamLead={teamLead} setTeamLead={setTeamLead} teamLeads={teamLeads} />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            + Create Project
          </button>
        </div>
      </form>
      <ProjectSummary
        projectName={projectName}
        category={category}
        startDate={startDate}
        endDate={endDate}
        teamLead={teamLead}
      />
    </div>
  );
};

export default ProjectForm;
