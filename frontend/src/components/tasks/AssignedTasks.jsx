import React, { useState } from "react";

const AssignedTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Website Redesign",
      assignedTo: "John Doe",
      priority: "High",
      dueDate: "Dec 25, 2025",
      status: "In Progress",
      progress: 60,
    },
    {
      id: 2,
      title: "Mobile App Development",
      assignedTo: "Jane Smith",
      priority: "Medium",
      dueDate: "Jan 15, 2025",
      status: "Completed",
      progress: 100,
    },
    {
      id: 3,
      title: "Dashboard UI Design",
      assignedTo: "Alice Brown",
      priority: "Low",
      dueDate: "Feb 10, 2025",
      status: "Pending",
      progress: 20,
    },
  ]);

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 p-2 border rounded-md"
          />
          <button className="px-4 py-2 text-white bg-blue-600 rounded">
            + Add New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <select className="p-2 border rounded-md">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="p-2 border rounded-md">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select className="p-2 border rounded-md">
            <option>All Team Leads</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>

        {/* Task Table */}
        <div className="p-6 overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="font-semibold text-left text-gray-700 border-b">
                <th className="p-3">Task</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-3">{task.title}</td>
                    <td className="p-3">{task.assignedTo}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          task.priority === "High"
                            ? "bg-red-500"
                            : task.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3">{task.dueDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-white rounded ${
                          task.status === "Completed"
                            ? "bg-green-500"
                            : task.status === "In Progress"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="p-3">
                      <button className="mr-2 text-blue-600">✏️</button>
                      <button className="text-red-600">🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
