import React from "react";
import StatusBadge from "./StatusBadge";
;

const TaskRow = ({ task, onEdit, onComment, handleDeleteTask }) => {
  return (
    <tr className="border-b">
      <td className="py-3 px-4">{task.name}</td>
      <td className="py-3 px-4 flex items-center">
        <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-6 h-6 rounded-full mr-2" />
        {task.assignName}
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={task.status} />
      </td>
      <td className="py-3 px-4">{task.dueDate.split("T")[0]}</td>
      <td className="py-3 px-4 flex space-x-2">
        <button onClick={() => onComment(task.id)} className="text-gray-500 hover:text-gray-700">💬</button>
        <button onClick={() => onEdit(task.id)} className="text-gray-500 hover:text-gray-700">✏️</button>
        <button
          className="text-red-600"
          onClick={() => handleDeleteTask(task.id)}
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default TaskRow;
