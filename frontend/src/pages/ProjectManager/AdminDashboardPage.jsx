import React, { useState } from 'react';
import Navbar from '../../components/Other/NavBar';
import Sidebar from '../../components/Other/sideBar';
import { HiMenu, HiPlus } from 'react-icons/hi';
import CreateProject from '../../components/forms/CreateProject';
import ProjectCard from '../../components/projects/ProjectCard';

const project = {
  name: 'Website Redesign',
  status: 'In Progress',
  progress: 75,
  deadline: '2023-12-31',
  budget: 15000,
  lastUpdated: '2023-10-01',
};

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleCreateProjectClick = () => {
    setIsCreateProjectOpen(true);
  };

  const handleCloseCreateProject = () => {
    setIsCreateProjectOpen(false);
  };

  const handleCreateProject = (newProject) => {
    setProjects([...projects, newProject]);
    setIsCreateProjectOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <Sidebar />
        </div>


        <div className="flex-1 lg:ml-64">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed z-50 p-2 text-white rounded-md top-20 left-4 bg-primary-600 lg:hidden"
          >
            <HiMenu size={24} />
          </button>

          {/* Content Area */}
          <main className="p-6">
            {/* Create Project Card */}
            <div className="flex justify-center mt-8">
              <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
                <button
                  onClick={handleCreateProjectClick}
                  className="flex items-center justify-center w-16 h-16 text-white transition-colors bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
                >
                  <HiPlus size={32} />
                </button>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Create New Project</h3>
              </div>
            </div>

            {/* Project Cards */}
            <div className="flex flex-wrap justify-center mt-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </main>
        </div>

        {/* Create Project Overlay */}
        {isCreateProjectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay Background */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Modal Content */}
            <div className="relative z-50 w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
              <button
                onClick={handleCloseCreateProject}
                className="absolute text-gray-500 top-2 right-2 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
              <CreateProject onCreateProject={handleCreateProject} />
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div> 
      
    </div>
  );
};

export default AdminDashboard;
