import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// GraphQL Query for fetching tasks assigned to a Team Lead
const GET_TASKS_FOR_LEAD = gql`
  query GetTasksForLead($teamLeadId: ID!) {
    getTasksForLead(teamLeadId: $teamLeadId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
      assignName
      createdAt
      attachments
      updatedAt
      remarks
    }
  }
`;

const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };

const MyTasks = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let teamLeadId = null;

  try {
    const decodedToken = token ? jwtDecode(token) : null;
    teamLeadId = decodedToken?.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  const shouldSkipQuery = !teamLeadId;
  const { data, loading, error } = useQuery(GET_TASKS_FOR_LEAD, {
    variables: { teamLeadId },
    skip: shouldSkipQuery,
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");

  if (loading) return <p className="mt-10 text-center text-gray-700">Loading tasks...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  let tasks = data?.getTasksForLead || [];

  // Filtering by search term
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting by priority
  if (sortPriority) {
    filteredTasks.sort((a, b) =>
      sortPriority === "High"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }

  // Sorting by status (Fixed)
  if (sortStatus) {
    filteredTasks.sort((a, b) =>
      sortStatus === "Completed"
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status]
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        />
        <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          + Add New Task
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
          onChange={(e) => setSortPriority(e.target.value)}
          value={sortPriority}
        >
          <option value="">Sort by Priority</option>
          <option value="High">High → Low</option>
          <option value="Low">Low → High</option>
        </select>

        <select
          className="p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
          onChange={(e) => setSortStatus(e.target.value)}
          value={sortStatus}
        >
          <option value="">Sort by Status</option>
          <option value="Pending">Pending → Completed</option>
          <option value="Completed">Completed → Pending</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-200">
              <th className="p-3">Task</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-white rounded-md text-sm ${
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
                  <td className="p-3">{task.dueDate ? task.dueDate.split("T")[0] : "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-white rounded-md text-sm ${
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
                  <td className="p-3 flex justify-center space-x-2">
                    <button className="text-blue-600 hover:underline">✏️</button>
                    <button className="text-red-600 hover:underline">🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTasks;
