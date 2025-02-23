import React, { useState } from 'react';
import Navbar from '../../components/Other/Navbar';
import Sidebar from '../../components/Other/sideBar';
import { HiMenu, HiPlus } from 'react-icons/hi';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-20 left-4 p-2 text-white bg-primary-600 rounded-md lg:hidden z-50"
          >
            <HiMenu size={24} />
          </button>

          {/* Content Area */}
          <main className="p-6">
     
            {/* Create Project Card */}
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                <button className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                  <HiPlus size={32} />
                </button>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">Create New Project</h3>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;