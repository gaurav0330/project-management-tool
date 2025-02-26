import React from "react";

const TaskOverview = ({ total, completed, pending }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-sm">Total Tasks</h3>
        <h2 className="text-2xl font-bold">{total}</h2>
        <p className="text-green-500 text-sm">↑ 12% from last month</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-sm">Completed Tasks</h3>
        <h2 className="text-2xl font-bold">{completed}</h2>
        <p className="text-green-500 text-sm">↑ 8% from last month</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-600 text-sm">Pending Tasks</h3>
        <h2 className="text-2xl font-bold">{pending}</h2>
        <p className="text-red-500 text-sm">↓ 3% from last month</p>
      </div>
    </div>
  );
};

export default TaskOverview;
