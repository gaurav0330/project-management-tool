import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AssignTasks from "./AssignTasks";

// GraphQL Query
const GET_TASKS_BY_MANAGER = gql`
  query GetTasksByManager($managerId: ID!, $projectId: ID!) {
    getTasksByManager(managerId: $managerId, projectId: $projectId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
      createdAt
      attachments
      updatedAt
      remarks
      assignName
    }
  }
`;
 
const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };

const AssignedTasks = () => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from URL

  // Get managerId from token
  const token = localStorage.getItem("token");
  let managerId = null;

  try {
    const decodedToken = token ? jwtDecode(token) : null;
    managerId = decodedToken?.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  

  // Ensure both managerId and projectId are available
  const shouldSkipQuery = !managerId || !projectId;

  // Fetch tasks using query with variables
  const { data, loading, error } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
    skip: shouldSkipQuery,
    fetchPolicy: "network-only", // Ensure fresh data on every load
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");

  if (loading) return <p className="mt-10 text-center">Loading tasks...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  let tasks = data?.getTasksByManager || [];

  // Filter tasks based on search term
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting by priority
  if (sortPriority) {
    filteredTasks.sort(
      (a, b) =>
        (sortPriority === "High"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority])
    );
  }

  // Apply sorting by status
  if (sortStatus) {
    filteredTasks.sort(
      (a, b) =>
        (sortStatus === "Pending"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status])
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
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
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded"
            onClick={() => navigate(0, { state: { modal: <AssignTasks /> } })}
          >
            + Add New Task
          </button>
        </div>

        {/* Filters & Sorting */}
        <div className="flex gap-4 mb-4">
          <select
            className="p-2 border rounded-md"
            onChange={(e) => setSortPriority(e.target.value)}
            value={sortPriority}
          >
            <option value="">Sort by Priority</option>
            <option value="High">High → Low</option>
            <option value="Low">Low → High</option>
          </select>

          <select
            className="p-2 border rounded-md"
            onChange={(e) => setSortStatus(e.target.value)}
            value={sortStatus}
          >
            <option value="">Sort by Status</option>
            <option value="Pending">Pending → Completed</option>
            <option value="Completed">Completed → Pending</option>
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-3">{task.title}</td>
                    <td className="p-3">{task.assignName || "N/A"}</td>
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
                    <td className="p-3">{task.dueDate.split("T")[0] || "N/A"}</td>
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
                      <button className="mr-2 text-blue-600">✏️</button>
                      <button className="text-red-600">🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
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
