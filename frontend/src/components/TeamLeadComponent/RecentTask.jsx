import React from "react";

const RecentTasks = ({ tasks }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">Recent Tasks</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Task Name</th>
            <th className="p-2">Assignee</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t">
              <td className="p-2">{task.name}</td>
              <td className="p-2 flex items-center">
                <img src={task.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                {task.assignee}
              </td>
              <td className="p-2">{task.dueDate}</td>
              <td className={`p-2 ${task.status === "Completed" ? "text-green-600" : task.status === "In Progress" ? "text-yellow-500" : "text-blue-600"}`}>
                {task.status}
              </td>
              <td className="p-2">{task.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTasks;
