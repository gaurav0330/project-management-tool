import { useState, useEffect } from "react";
import React from "react";
import { MdDashboard, MdSupervisorAccount, MdAnalytics, MdGroup, MdAssignmentTurnedIn, MdAssignment, MdPeople, MdInsights, MdBarChart, MdFolderOpen, MdDescription, MdTimeline, MdMenu, MdClose } from "react-icons/md";
import './Sidebar.css'; // Import the CSS file for animations

const Sidebar = ({ setActiveComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activeItem, setActiveItem] = useState(null); // Track active item

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.role) {
      setUserRole(storedUser.role);
    }
  }, []);

  const roleBasedMenu = {
    Project_Manager: [
      {
        category: "Overview",
        items: [{ name: "Home", icon: MdDashboard, component: "dashboard" }],
      },
      {
        category: "Project Management",
        items: [
          { name: "Project Home", icon: MdDashboard, component: "projectHome" },
          { name: "Manage Lead", icon: MdSupervisorAccount, component: "managelead" },
          { name: "Manage Task", icon: MdAssignment, component: "assignedTasks" },
          { name: "Manage Team", icon: MdGroup, component: "manageteam" },
          { name: "Create Tasks", icon: MdAssignment, component: "tasks" },
          { name: "Members", icon: MdAssignment, component: "members" },
          { name: "Approve Task", icon: MdAssignment, component: "approvetask" },
        ],
  
      },{
        category:"Analytics Section",
        items:[
          { name: "Timeline", icon: MdTimeline, component: "TimeLine" },
          { name: "Analytics", icon: MdAnalytics, component: "analytics" },
        ],
      }
    ],
    Team_Lead: [
      {
        category: "My Tasks",
        items: [
          { name: "Project Home", icon: MdDashboard, component: "projectHome" },
          { name: "My Tasks", icon: MdAssignment, component: "mytasks" },
          { name: "Task Submit", icon: MdAssignment, component: "approvetask" },
        ],
      },
      {
        category: "Manage Team",
        items: [
          { name: "Create Team", icon: MdFolderOpen, component: "createteam" },
          { name: "My Teams", icon: MdGroup, component: "myteams" },
        ],
      },
    ],
    Team_Member: [
      {
        category: "Overview",
        items: [{ name: "Dashboard", icon: MdDashboard, component: "overview" }],
      },
      {
        category: "Tasks",
        items: [
          { name: "My Tasks", icon: MdAssignment, component: "tasks" },
        ],
      },
    ],
  };

  const sidebarMenu = roleBasedMenu[userRole] || [];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 text-white transition duration-300 rounded-md top-4 left-4 bg-navy-600 lg:hidden hover:bg-navy-700"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-light-gray shadow-lg border border-gray-300 transition-transform duration-300 ease-in-out transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          w-64 z-40 flex flex-col rounded-lg`}
      >
        <div className="flex items-center justify-center flex-shrink-0 h-16 rounded-t-lg bg-navy-600">
          <h1 className="text-xl font-bold text-white">Project Manager</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
            {sidebarMenu.length > 0 ? (
              sidebarMenu.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-6">
                  <h2 className="p-2 px-4 mb-3 text-xs font-semibold tracking-wider text-gray-600 uppercase bg-gray-200 rounded-md">
                    {category.category}
                  </h2>
                  <div className="space-y-3"> {/* Increased spacing between buttons */}
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => {
                          setActiveComponent(item.component);
                          setActiveItem(item.name); // Set active item
                          setIsOpen(false); // Close sidebar on mobile
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm text-gray-600 border border-black transition-transform duration-200 rounded-lg 
                          ${activeItem === item.name ? 'bg-blue-200' : 'hover:bg-blue-100'} 
                          hover:shadow-lg transform hover:scale-105`} // 3D effect on hover
                      >
                        <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-50">
                          {React.createElement(item.icon, { className: "w-5 h-5 text-blue-600" })}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                  {categoryIndex < sidebarMenu.length - 1 && <hr className="my-4 border-gray-300" />} {/* Divider */}
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-gray-500">Loading menu...</p>
            )}
          </nav>
        </div>
      </div>

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
