import React, { useState } from 'react';
import { FaProjectDiagram, FaKey } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md'; // Using MdDashboard as a placeholder
import { BsPeopleFill } from 'react-icons/bs';

const CreateProject = ({ onCreateProject }) => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString());

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      name,
      key,
      progress,
      deadline,
      budget,
      lastUpdated,
      status: 'Not Started', // Default status
    };
    onCreateProject(newProject); // Call the function passed from AdminDashboard
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
        Add Project Details
      </h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Name</label>
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <FaProjectDiagram className="mx-3 text-gray-400" />
          <input
            type="text"
            placeholder="Project 1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-3 py-2 focus:outline-none"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Key</label>
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
          <FaKey className="mx-3 text-gray-400" />
          <input
            type="text"
            placeholder="PROJ"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-3 py-2 focus:outline-none"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Progress</label>
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="0"
          min="0"
          max="100"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Budget</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="0"
          required
        />
      </div>
      <div className="flex justify-end">
        <button type="button" className="px-4 py-2 mr-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
          Create Project
        </button>
      </div>
    </form>
  );
};

export default CreateProject;
