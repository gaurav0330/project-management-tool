import React from "react";

const TaskCard = ({ task, onEdit, onDelete, onMove }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-3">
      <div className="flex justify-between">
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">{task.category}</span>
        <select
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value)}
          className="text-sm text-gray-600 bg-transparent focus:outline-none"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <h3 className="text-lg font-bold mt-2">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
      <div className="flex items-center mt-2">
        <img src={task.assignedTo.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
        <span className="text-sm">{task.assignedTo.name}</span>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
        <div>
          <button onClick={() => onEdit(task.id)} className="text-blue-500 mr-2">✏️</button>
          <button onClick={() => onDelete(task.id)} className="text-red-500">🗑️</button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
