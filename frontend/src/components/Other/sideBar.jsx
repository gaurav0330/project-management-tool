import React from "react";
import { HiChartPie, HiViewBoards, HiInbox, HiUser, HiShoppingBag, HiArrowSmRight, HiTable } from "react-icons/hi";

export default function SideBar() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-lg h-full w-64 p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiChartPie className="mr-3" />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiViewBoards className="mr-3" />
              <span>Kanban</span>
              <span className="ml-auto bg-gray-800 text-white text-xs px-2 py-1 rounded">Pro</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiInbox className="mr-3" />
              <span>Inbox</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded">3</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiUser className="mr-3" />
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiShoppingBag className="mr-3" />
              <span>Products</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiArrowSmRight className="mr-3" />
              <span>Sign In</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-600 transition-all duration-300">
              <HiTable className="mr-3" />
              <span>Sign Up</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
