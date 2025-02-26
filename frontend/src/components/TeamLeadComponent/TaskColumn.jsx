import React from "react";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, tasks, onEdit, onDelete, onMove }) => {
  return (
    <div className="w-1/3 p-3">
      <h2 className="text-lg font-bold mb-3">{title} <span className="text-gray-500">({tasks.length})</span></h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
      ))}
    </div>
  );
};

export default TaskColumn;
