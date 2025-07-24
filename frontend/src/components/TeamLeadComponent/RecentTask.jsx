import React from "react";

const RecentTasks = ({ tasks = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100";
      case "In Progress":
        return "bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100";
      default:
        return "bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100";
    }
  };

  const getPriorityTag = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="card w-full overflow-hidden">
      <h3 className="text-heading-accent text-center mb-6 text-lg sm:text-xl">
        Recent Tasks
      </h3>

      {/* ✅ Task Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium">Total</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-success/20 dark:bg-success/30 text-success rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-warning/20 dark:bg-yellow-800 text-warning rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium">In Progress</p>
          <p className="text-2xl font-bold">{inProgressTasks}</p>
        </div>
      </div>

      {/* ✅ Task Table */}
      <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">Task Name</th>
              <th className="p-3 text-left">Member Name</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition duration-200"
              >
                <td className="p-3 font-medium text-txt-primary-light dark:text-txt-primary-dark">
                  {task.name}
                </td>

                <td className="p-3 flex items-center gap-2">
            
                  <span className="text-txt-primary-light dark:text-txt-primary-dark">
                    {task.assigneeName || "Unassigned"}
                  </span>
                </td>

                <td className="p-3 text-txt-secondary-light dark:text-txt-secondary-dark">
                  {task.dueDate}
                </td>

                <td className="p-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getPriorityTag(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <p className="p-4 text-center text-muted">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default RecentTasks;
