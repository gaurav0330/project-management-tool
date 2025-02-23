import React from "react";

export default function KPIWidgets({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Tasks Completed */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800">Tasks Completed</h3>
        <p className="text-2xl font-bold text-green-500">{stats.tasksCompleted}</p>
      </div>

      {/* Open Issues */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800">Open Issues</h3>
        <p className="text-2xl font-bold text-red-500">{stats.openIssues}</p>
      </div>

      {/* Sprint Velocity */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800">Sprint Velocity</h3>
        <p className="text-2xl font-bold text-blue-500">{stats.sprintVelocity}</p>
      </div>
    </div>
  );
}
