import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
   const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Design Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl p-8 mx-auto bg-white shadow-sm rounded-xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Create New Project</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Project Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  Select Team Lead
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center p-3 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="object-cover w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="mb-6 text-lg font-medium text-gray-900">Project Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Project Name</p>
                <p className="text-sm font-medium text-gray-900">{projectName || 'New Marketing Campaign'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">{selectedCategory || 'Marketing'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-sm font-medium text-gray-900">
                  {startDate && endDate 
                    ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                    : 'Jan 15, 2025 - Mar 30, 2025'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Team Lead</p>
                <div className="flex items-center mt-1">
                  <img
                    src={teamMembers[2].avatar}
                    alt={teamMembers[2].name}
                    className="object-cover w-8 h-8 rounded-full"
                  />
                  <p className="ml-2 text-sm font-medium text-gray-900">{teamMembers[2].name}</p>
                </div>
              </div>

              <button
                className="w-full px-4 py-2 mt-6 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  navigate('/assignLead');
                }}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;