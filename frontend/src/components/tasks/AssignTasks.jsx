import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";

// GraphQL Query to fetch leads by project ID
const GET_LEADS_BY_PROJECT_ID = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      leadRole
      teamLeadId {
        id
        username
        email
        role
      }
    }
  }
`;

// Updated GraphQL Mutation to assign a task
const ASSIGN_TASK = gql`
  mutation AssignTask(
    $projectId: ID!
    $title: String!
    $assignedTo: ID!
    $priority: String
    $dueDate: String
    $description: String
  ) {
    assignTask(
      projectId: $projectId
      title: $title
      assignedTo: $assignedTo
      priority: $priority
      dueDate: $dueDate
      description: $description
    ) {
      success
      message
      task {
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
      }
    }
  }
`;

const AssignTasks = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Fetch team leads based on project ID
  const { data, loading, error } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  const teamLeads = data?.getLeadsByProjectId || []; // Ensure teamLeads is always an array

  // Use Mutation Hook
  const [assignTask, { loading: assignLoading, error: assignError }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTask.success) {
        alert("Task assigned successfully!");
        navigate(`/projectHome/${projectId}`);
      } else {
        alert(data.assignTask.message || "Failed to assign task");
      }
    },
  });

  // Function to handle task creation
  const handleCreateTask = () => {
    if (!taskTitle.trim() || !assignedTo) {
      alert("Task title and assigned user are required");
      return;
    }

    assignTask({
      variables: {
        projectId,
        title: taskTitle,
        description,
        assignedTo,
        priority,
        dueDate,
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Create New Task</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 p-2 border rounded-md"
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700">Assign to</label>
              {loading ? (
                <p>Loading leads...</p>
              ) : error ? (
                <p className="text-red-500">Error loading leads</p>
              ) : (
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Team Lead</option>
                  {teamLeads.map((lead) => (
                    <option key={lead.teamLeadId.id} value={lead.teamLeadId.id}>
                      {lead.teamLeadId.username} - {lead.teamLeadId.email} ({lead.leadRole})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
              onClick={handleCreateTask}
              disabled={assignLoading}
            >
              {assignLoading ? "Assigning..." : "Create Task"}
            </button>
            {assignError && <p className="text-red-500">Failed to assign task</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTasks;