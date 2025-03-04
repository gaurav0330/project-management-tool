import { useState } from "react";
import React from "react";
import { MdDashboard,MdPeople, MdAssignment, MdTimeline, MdBarChart, MdMenu, MdClose } from "react-icons/md";

const TeamSidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Static Sidebar Items
  const sidebarMenu = [
    { name: "Project Home", icon: MdDashboard, component: "projectHome" },
    { name: "Create Tasks", icon: MdAssignment, component: "createtasks" },
    { name: "Manage Tasks", icon: MdTimeline, component: "managetasks" },
    { name: "Approve Tasks", icon: MdBarChart, component: "approvetasks" },
    { name: "Add Members", icon: MdPeople, component: "addmembers" },
    { name: "Task Distribution", icon: MdBarChart, component: "taskDistribution" },
    { name: "Reports", icon: MdBarChart, component: "reports" },
    
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 text-white rounded-md top-4 left-4 bg-primary-600 lg:hidden hover:bg-primary-700"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          w-64 z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center flex-shrink-0 h-16 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Project Manager</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
            {sidebarMenu.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.component) setActiveComponent(item.component);
                  setIsOpen(false); // Close sidebar on mobile
                }}
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 group"
              >
                {React.createElement(item.icon, { className: "w-5 h-5 mr-3" })}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default TeamSidebar;
