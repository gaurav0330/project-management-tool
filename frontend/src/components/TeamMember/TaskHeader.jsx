import React from "react";

const TaskHeader = ({ title, dueDate, priority, teamMembers = [] }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded shadow">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500">📅 Due: {dueDate.split("T")[0]}</p>

        <span className="px-2 py-1 font-bold text-red-500 bg-red-100 rounded">{priority}</span>
      </div>
      <div className="flex space-x-2">
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <img key={index} src={member} alt="Member" className="w-8 h-8 border rounded-full" />
          ))
        ) : (
          <p className="text-gray-400">No team members</p>
        )}
        <button className="px-2 py-1 bg-gray-300 rounded">+</button>
      </div>
    </div>
  );
};

export default TaskHeader;
