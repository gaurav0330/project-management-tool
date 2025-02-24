
import React from "react";
import Sidebar from '../Other/sideBar';

const ProjectOverview = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
        {/* <aside className="w-1/5 p-4 bg-white shadow-md">
        <h2 className="mb-4 text-lg font-bold">ProjectHub</h2>
        <ul className="space-y-3">
          <li className="p-2 text-blue-700 bg-blue-100 rounded-md cursor-pointer">Dashboard</li>
          <li className="p-2 rounded-md cursor-pointer hover:bg-gray-200">Tasks</li>
          <li className="p-2 rounded-md cursor-pointer hover:bg-gray-200">Team</li>
          <li className="p-2 rounded-md cursor-pointer hover:bg-gray-200">Reports</li>
        </ul>
      </aside>   */}
      

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Project Overview */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Website Redesign Project</h2>
          <p className="text-sm text-gray-600">
            📅 <span className="font-medium">Start:</span> Jan 15, 2025 &nbsp;&nbsp;
            ⏳ <span className="font-medium">Deadline:</span> Mar 30, 2025
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Overall Progress</p>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div className="h-3 bg-blue-600 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="mt-1 text-sm font-medium text-right">65%</p>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="p-4 text-center bg-gray-100 rounded-md">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-xl font-semibold text-blue-700">48</p>
            </div>
            <div className="p-4 text-center bg-gray-100 rounded-md">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-green-600">31</p>
            </div>
            <div className="p-4 text-center bg-gray-100 rounded-md">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">12</p>
            </div>
            <div className="p-4 text-center bg-gray-100 rounded-md">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-xl font-semibold text-red-600">5</p>
            </div>
          </div>
        </div>

        {/* Task Management Board */}
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Task Management</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* To Do */}
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-700">To Do</h3>
              <div className="p-2 mt-2 bg-white rounded-md shadow-sm">
                <p className="font-medium">Design Homepage</p>
                <p className="text-xs text-gray-500">Create wireframes</p>
              </div>
              <div className="p-2 mt-2 bg-white rounded-md shadow-sm">
                <p className="font-medium">User Research</p>
                <p className="text-xs text-gray-500">Conduct interviews</p>
              </div>
            </div>

            {/* In Progress */}
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-700">In Progress</h3>
              <div className="p-2 mt-2 bg-white rounded-md shadow-sm">
                <p className="font-medium">UI Components</p>
                <p className="text-xs text-gray-500">Build design system</p>
              </div>
            </div>

            {/* Review */}
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-700">Review</h3>
              <div className="p-2 mt-2 bg-white rounded-md shadow-sm">
                <p className="font-medium">Navigation Menu</p>
                <p className="text-xs text-gray-500">Final review</p>
              </div>
            </div>

            {/* Done */}
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold text-gray-700">Done</h3>
              <div className="p-2 mt-2 bg-white rounded-md shadow-sm">
                <p className="font-medium">Project Setup</p>
                <p className="text-xs text-gray-500">Initial configuration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity */}
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Live Activity</h2>
          <div className="space-y-3">
            <div className="text-sm">
              <p>
                <span className="font-medium text-blue-700">Sarah Chen</span> completed task{" "}
                <span className="text-blue-600 cursor-pointer">Homepage Design</span>
              </p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-medium text-blue-700">Mike Roberts</span> updated deadline for{" "}
                <span className="text-blue-600 cursor-pointer">User Testing</span>
              </p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-medium text-blue-700">Alex Kim</span> added comments to{" "}
                <span className="text-blue-600 cursor-pointer">Navigation Design</span>
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-medium text-blue-700">Emma Wilson</span> started working on{" "}
                <span className="text-blue-600 cursor-pointer">Mobile Layout</span>
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectOverview;
