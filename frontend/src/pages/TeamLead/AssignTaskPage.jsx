import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";

// GraphQL Query to fetch team members under a team lead
const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamLeadId: ID!, $projectId: ID!) {
    getTeamMembers(teamLeadId: $teamLeadId, projectId: $projectId) {
      teamMemberId
      memberRole
      user {
        id
        username
        email
        role
      }
    }
  }
`;

// GraphQL Mutation to assign a task
const ASSIGN_TASK = gql`
  mutation AssignTaskMember(
    $projectId: ID!
    $title: String!
    $description: String
    $assignedTo: ID!
    $priority: String
    $dueDate: String
  ) {
    assignTaskMember(
      projectId: $projectId
      title: $title
      description: $description
      assignedTo: $assignedTo
      priority: $priority
      dueDate: $dueDate
    ) {
      success
      message
    }
  }
`;

const AssignTasks = ({ projectId , teamId}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const teamLeadId = decodedToken?.id || null; // Extract teamLeadId

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Fetch team members based on teamLeadId and projectId
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId, // Skip query if no teamLeadId is found
  });

  const teamMembers = data?.getTeamMembers || []; // Ensure teamMembers is always an array

  // Mutation for assigning a task
  const [assignTask, { loading: assignLoading, error: assignError }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTaskMember.success) {
        alert("Task assigned successfully!");
        navigate(`/teamlead/project/${projectId}/${teamId}`);
      } else {
        alert(data.assignTaskMember.message || "Failed to assign task");
      }
      navigate(`/teamlead/project/${projectId}/${teamId}`);
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

  const uniqueTeamMembers = Array.from(
    new Map(teamMembers.map((member) => [member.user.email, member])).values()
  );
  
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
                <p>Loading team members...</p>
              ) : error ? (
                <p className="text-red-500">Error loading team members</p>
              ) : (
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Team Member</option>
                  {uniqueTeamMembers.map((member) => (
                    <option key={member.teamMemberId} value={member.user.id}>
                      {member.user.username} - {member.user.email} ({member.memberRole})
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
