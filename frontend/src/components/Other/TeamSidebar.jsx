import { useState } from "react";
import React from "react";
import {
  MdDashboard,
  MdPeople,
  MdAssignment,
  MdTimeline,
  MdBarChart,
  MdMenu,
  MdClose,
} from "react-icons/md";
import "./SideBar.css"; // Import sidebar styles

const TeamSidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // Track active item

  // Organized sidebar menu with categories
  const sidebarMenu = [
    {
      category: "Project Overview",
      items: [{ name: "Project Home", icon: MdDashboard, component: "projectHome" }],
    },
    {
      category: "Task Management",
      items: [
        { name: "Create Tasks", icon: MdAssignment, component: "createtasks" },
        { name: "Manage Tasks", icon: MdTimeline, component: "managetasks" },
        { name: "Approve Tasks", icon: MdBarChart, component: "approvetasks" },
      ],
    },
    {
      category: "Team & Reports",
      items: [
        { name: "Add Members", icon: MdPeople, component: "addmembers" },
        { name: "Task Distribution", icon: MdBarChart, component: "taskDistribution" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 text-white transition duration-300 bg-gray-800 rounded-md top-4 left-4 lg:hidden hover:bg-gray-900"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border border-gray-300 transition-transform duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          w-64 z-40 flex flex-col rounded-lg`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16 bg-gray-800 rounded-t-lg">
          <h1 className="text-xl font-bold text-white">Team Dashboard</h1>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {sidebarMenu.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              <h2 className="p-2 px-4 mb-3 text-xs font-semibold tracking-wider text-gray-600 uppercase bg-gray-200 rounded-md">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => {
                      setActiveComponent(item.component);
                      setActiveItem(item.name); // Highlight active item
                      setIsOpen(false); // Close sidebar on mobile
                    }}
                    className={`flex items-center w-full px-4 py-3 text-gray-600 transition-transform duration-200 transform border border-gray-300 rounded-lg 
                      ${activeItem === item.name ? "bg-blue-200" : "hover:bg-blue-100"} 
                      hover:shadow-lg hover:scale-105`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-50">
                      {React.createElement(item.icon, { className: "w-5 h-5 text-blue-600" })}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
              {categoryIndex < sidebarMenu.length - 1 && <hr className="my-4 border-gray-300" />}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay (Closes Sidebar when clicked) */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default TeamSidebar;
