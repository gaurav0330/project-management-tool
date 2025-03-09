import React from "react";
import TaskRow from "./TaskRow";

const TaskTable = ({ tasks, onEdit, onComment , handleDeleteTask }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3 px-4">Task Name</th>
            <th className="py-3 px-4">Assigned To</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onEdit={onEdit} onComment={onComment} handleDeleteTask={handleDeleteTask} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
