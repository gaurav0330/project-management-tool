import React from "react";

const RecentTasks = ({ tasks }) => {
  // Count tasks based on status
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-6 transition transform duration-300 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Recent Tasks</h3>

      {/* Task Summary */}
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div className="bg-blue-100 p-3 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-blue-700">Total</p>
          <p className="text-lg font-bold">{totalTasks}</p>
        </div>
        <div className="bg-green-100 p-3 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-green-700">Completed</p>
          <p className="text-lg font-bold">{completedTasks}</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-yellow-700">In Progress</p>
          <p className="text-lg font-bold">{inProgressTasks}</p>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="p-3">Task Name</th>
              <th className="p-3">Assignee</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b transition duration-300 hover:bg-gray-100"
              >
                <td className="p-3">{task.name}</td>
                <td className="p-3 flex items-center">
                  <img
                    src={task.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-3 shadow-sm"
                  />
                  {task.assignee}
                </td>
                <td className="p-3">{task.dueDate}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : task.status === "In Progress"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3 font-medium text-gray-700">{task.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;