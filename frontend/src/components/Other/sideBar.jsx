
import { useState } from "react";
import {

import React from "react";
import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiArrowSmRight, HiTable } from "react-icons/hi";

import { useState } from 'react';
import { master
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

  const menuItems = [
    {
      category: "Overview",
      items: [
        { name: "Dashboard", icon: MdDashboard, component: "overview" },
        { name: "Analytics", icon: MdInsights },
        { name: "Reports", icon: MdBarChart },
      ],
    },
    {
      category: "Project Management",
      items: [
        { name: "Projects", icon: MdFolderOpen },
        { name: "Tasks", icon: MdAssignment, component: "tasks" }, // ✅ Set "Tasks" component
        { name: "Timeline", icon: MdTimeline },
        { name: "Documents", icon: MdDescription },
      ],
    },
    {
      category: "Team & Communication",
      items: [
        { name: "Team Members", icon: MdPeople, component: "members" }, // ✅ Set "Team Members" component
      ],
    },
  ];


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
            {menuItems.map((category, categoryIndex) => (
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

}

// import React from "react";
// import { Sidebar } from "flowbite-react";
// import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

// export default function SideBar() {
//   return (
//     <Sidebar aria-label="Sidebar Example" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg">
//       <Sidebar.Items>
//         <Sidebar.ItemGroup>
//           <Sidebar.Item href="#" icon={HiChartPie} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Dashboard
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiViewBoards} label="Pro" labelColor="dark" className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Kanban
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiInbox} label="3" className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Inbox
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiUser} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Users
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiShoppingBag} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Products
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiArrowSmRight} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Sign In
//           </Sidebar.Item>
//           <Sidebar.Item href="#" icon={HiTable} className="transition-all duration-300 hover:bg-blue-600 hover:text-white rounded-lg p-3">
//             Sign Up
//           </Sidebar.Item>
//         </Sidebar.ItemGroup>
//       </Sidebar.Items>
//     </Sidebar>
//   );
// }

};

export default Sidebar;

