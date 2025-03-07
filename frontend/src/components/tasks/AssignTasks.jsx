import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Alert, Snackbar } from "@mui/material";

// GraphQL Query to fetch leads by project ID
const GET_LEADS_BY_PROJECT_ID = gql`
  query GetLeadsByProjectId($projectId: ID!) {
    getLeadsByProjectId(projectId: $projectId) {
      teamLeads {
        teamLeadId
        leadRole
        user {
          id
          username
          email
        }
      }
    }
  }
`;

// GraphQL Mutation to assign a task
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
    }
  }
`;

const AssignTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch team leads based on project ID
  const { data, loading, error } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
  });

  // Remove duplicate leads
  const uniqueTeamLeads = Array.from(
    new Map(
      (data?.getLeadsByProjectId?.teamLeads || []).map((lead) => [lead.teamLeadId, lead])
    ).values()
  );

  // Use Mutation Hook
  const [assignTask, { loading: assignLoading }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTask.success) {
        setSnackbarMessage("Task assigned successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => navigate(0), 2000);
      } else {
        setSnackbarMessage(data.assignTask.message || "Failed to assign task");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    },
    onError: () => {
      setSnackbarMessage("Failed to assign task");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !assignedTo) {
      setSnackbarMessage("Task title and assigned user are required");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
                  {uniqueTeamLeads.map((lead) => (
                    <option key={lead.teamLeadId} value={lead.teamLeadId}>
                      {lead.user.username} - {lead.user.email} ({lead.leadRole})
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
          </div>
        </div>
      </div>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AssignTasks;
