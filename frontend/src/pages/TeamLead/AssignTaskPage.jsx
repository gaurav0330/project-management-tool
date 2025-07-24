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

const AssignTasks = ({ projectId, teamId }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const teamLeadId = decodedToken?.id || null;

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  // Fetch team members based on teamLeadId and projectId
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });

  const teamMembers = data?.getTeamMembers || [];

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

    // Check if due date is in the past
    if (dueDate && dueDate < today) {
      alert("Due date cannot be in the past. Please select a valid date.");
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

  // Get selected assignee details for display
  const selectedAssignee = uniqueTeamMembers.find(member => member.user.id === assignedTo);

  // Priority options with colors and icons
  const priorityOptions = [
    { value: "Low", label: "🟢 Low Priority", color: "text-success" },
    { value: "Medium", label: "🟡 Medium Priority", color: "text-warning" },
    { value: "High", label: "🔴 High Priority", color: "text-error" }
  ];

  return (
    <div className="flex min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark transition-colors duration-200">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-lg border border-bg-accent-light dark:border-bg-accent-dark transition-all duration-200">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Create New Task
            </h2>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark font-caption text-lg">
              Assign a new task to your team members
            </p>
          </div>

          <div className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="block text-sm font-caption font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                Task Title *
              </label>
              <input
                type="text"
                placeholder="Enter a clear and descriptive task title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-4 font-body text-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-caption font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                Task Description
              </label>
              <textarea
                placeholder="Provide detailed instructions and requirements for this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-4 font-body bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark resize-none"
              />
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-caption font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-4 font-body text-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-caption font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  min={today} // Prevent past dates
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-4 font-body text-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200"
                />
                <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark font-caption">
                  📅 Due date cannot be in the past
                </p>
              </div>
            </div>

            {/* Assign To */}
            <div className="space-y-3">
              <label className="block text-sm font-caption font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                Assign to Team Member *
              </label>
              
              {loading ? (
                <div className="flex items-center space-x-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary-500"></div>
                  <span className="text-txt-secondary-light dark:text-txt-secondary-dark font-body">
                    Loading team members...
                  </span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 font-body">
                    ⚠️ Error loading team members. Please refresh and try again.
                  </p>
                </div>
              ) : (
                <>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full p-4 font-body text-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200"
                  >
                    <option value="">👥 Select a team member to assign this task</option>
                    {uniqueTeamMembers.map((member) => (
                      <option key={member.teamMemberId} value={member.user.id}>
                        👤 {member.user.username} ({member.memberRole}) - {member.user.email}
                      </option>
                    ))}
                  </select>

                  {/* Selected Assignee Preview */}
                  {selectedAssignee && (
                    <div className="p-4 bg-brand-primary-50 dark:bg-brand-primary-900/20 border-2 border-brand-primary-200 dark:border-brand-primary-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {selectedAssignee.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary-700 dark:text-brand-primary-300">
                            {selectedAssignee.user.username}
                          </h4>
                          <p className="text-sm text-brand-primary-600 dark:text-brand-primary-400 font-caption">
                            {selectedAssignee.memberRole} • {selectedAssignee.user.email}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span className="px-3 py-1 bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300 rounded-full text-xs font-medium">
                            Selected Assignee
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Error Message */}
            {assignError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">❌</span>
                  <p className="text-red-600 dark:text-red-400 font-body font-medium">
                    Failed to assign task. Please check your connection and try again.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-bg-accent-light dark:border-bg-accent-dark">
              <button
                onClick={handleCreateTask}
                disabled={assignLoading || !taskTitle.trim() || !assignedTo}
                className="flex-1 sm:flex-none px-8 py-4 font-button font-semibold text-lg text-white bg-brand-primary-500 hover:bg-brand-primary-600 disabled:bg-txt-muted-light disabled:cursor-not-allowed rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {assignLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Task...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>✅</span>
                    <span>Create & Assign Task</span>
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate(`/teamlead/project/${projectId}/${teamId}`)}
                className="flex-1 sm:flex-none px-8 py-4 font-button font-semibold text-lg text-txt-primary-light dark:text-txt-primary-dark bg-bg-accent-light dark:bg-bg-accent-dark hover:bg-bg-accent-light/80 dark:hover:bg-bg-accent-dark/80 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-txt-muted-light focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>↩️</span>
                  <span>Cancel</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTasks;