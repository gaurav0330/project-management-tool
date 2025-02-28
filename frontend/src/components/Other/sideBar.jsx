import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdDashboard,
  MdAssignment,
  MdPeople,
  MdInsights,
  MdBarChart,
  MdFolderOpen,
  MdDescription,
  MdTimeline,
  MdMenu,
  MdClose,
} from "react-icons/md";

const Sidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Fetch role from localStorage or API
    const role = localStorage.getItem("userRole") || "Team_Member"; // Default role
    setUserRole(role);
  }, []);

  // Role-Based Sidebar Items
  const roleBasedMenu = {
    Project_Manager: [
      {
        category: "Overview",
        items: [
          { name: "Add Project", icon: MdDashboard, component: "addproject" },
          { name: "Task Approval", icon: MdAssignment, component: "taskapproval" },
          { name: "Dashboard", icon: MdDashboard, component: "overview" },
          { name: "Analytics", icon: MdInsights },
          { name: "Reports", icon: MdBarChart },
        ],
      },
      {
        category: "Project Management",
        items: [
          { name: "Projects", icon: MdFolderOpen },
          { name: "Tasks", icon: MdAssignment, component: "tasks" },
          { name: "Timeline", icon: MdTimeline },
          { name: "Documents", icon: MdDescription },
        ],
      },
      {
        category: "Team & Communication",
        items: [
          { name: "Members", icon: MdPeople, component: "members" },
          { name: "Team Members", icon: MdPeople, component: "teammember" },
          { name: "Team Lead", icon: MdPeople, component: "teamlead" },
        ],
      },
    ],
    Team_Lead: [
      {
        category: "Overview",
        items: [
          { name: "Dashboard", icon: MdDashboard, component: "overview" },
          { name: "Analytics", icon: MdInsights },
        ],
      },
      {
        category: "Project Management",
        items: [
          { name: "Projects", icon: MdFolderOpen },
          { name: "Tasks", icon: MdAssignment, component: "tasks" },
        ],
      },
    ],
    Team_Member: [
      {
        category: "Overview",
        items: [
          { name: "Dashboard", icon: MdDashboard, component: "overview" },
        ],
      },
      {
        category: "Tasks",
        items: [
          { name: "My Tasks", icon: MdAssignment, component: "tasks" },
          { name: "Timeline", icon: MdTimeline },
        ],
      },
    ],
  };

  return (
    <>
      {/* Mobile menu button */}
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
            {roleBasedMenu[userRole]?.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-6">
                <h2 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  {category.category}
                </h2>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <button
                      key={itemIndex}
                      onClick={() => {
                        if (item.component) setActiveComponent(item.component);
                        setIsOpen(false); // Close sidebar on mobile
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 group"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
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

export default Sidebar;
