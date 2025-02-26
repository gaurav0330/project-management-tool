import React from "react";

const TaskHeader = ({ title, dueDate, priority, teamMembers }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500">📅 Due: {dueDate}</p>
        <span className="text-red-500 font-bold bg-red-100 px-2 py-1 rounded">{priority}</span>
      </div>
      <div className="flex space-x-2">
        {teamMembers.map((member, index) => (
          <img key={index} src={member} alt="Member" className="w-8 h-8 rounded-full border" />
        ))}
        <button className="bg-gray-300 px-2 py-1 rounded">+</button>
      </div>
    </div>
  );
};

export default TaskHeader;
