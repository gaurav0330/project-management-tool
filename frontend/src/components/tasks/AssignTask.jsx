import React, { useState } from 'react';

const AssignTask = () => {
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
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Project Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select category</option>
            <option value="Marketing">Marketing</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Select Team Lead</label>
          <div className="flex space-x-4">
            {teamLeads.map((lead) => (
              <div
                key={lead.id}
                className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer ${
                  teamLead === lead.name ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setTeamLead(lead.name)}
              >
                <img
                  src={`https://via.placeholder.com/50`}
                  alt={lead.name}
                  className="w-12 h-12 mb-2 rounded-full"
                />
                <p className="text-sm font-semibold">{lead.name}</p>
                <p className="text-xs text-gray-600">{lead.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            + Create Project
          </button>
        </div>
      </form>
      <div className="p-4 mt-6 bg-gray-100 rounded-lg">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold">Project Summary</h3>
        </div>
        <div className="space-y-2">
          <p><strong>Project Name:</strong> {projectName}</p>
          <p><strong>Category:</strong> {category}</p>
          <p>
            <strong>Duration:</strong> {startDate} - {endDate}
          </p>
          <p>
            <strong>Team Lead:</strong> {teamLead}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
