import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  Brain,
  Star,
  TrendingUp,
  Award,
  Target,
  Zap,
  Loader,
  Github,
  Users,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react";

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

// GraphQL Query for AI suggestions (for team members)
const SUGGEST_ASSIGNEES = gql`
  query SuggestAssignees($input: SuggestAssigneesInput!) {
    suggestAssignees(input: $input) {
      bestUser {
        userId
        username
        role
        score
        reasons
        profile {
          id
          GithubUsername
          availability
          workload
          skills {
            name
            proficiency
            experienceYears
          }
          experience {
            totalYears
            currentLevel
            projectsCompleted
          }
          performance {
            completionRate
            averageRating
            collaborationScore
          }
        }
      }
      rankedList {
        userId
        username
        role
        score
        reasons
        profile {
          id
          GithubUsername
          availability
          workload
          skills {
            name
            proficiency
          }
          experience {
            totalYears
            currentLevel
          }
          performance {
            completionRate
            averageRating
          }
        }
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
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  // Fetch team members based on teamLeadId and projectId
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });

  // AI Suggestions Query (lazy execution)
  const [getSuggestions, { loading: suggestionsLoading }] = useLazyQuery(SUGGEST_ASSIGNEES, {
    onCompleted: (data) => {
      setAiSuggestions(data.suggestAssignees);
      setShowAISuggestions(true);
    },
    onError: (error) => {
      console.error('AI Suggestions Error:', error);
      showNotification("error", "Failed to get AI suggestions");
    }
  });

  const teamMembers = data?.getTeamMembers || [];

  // Mutation for assigning a task
  const [assignTask, { loading: assignLoading, error: assignError }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTaskMember.success) {
        showNotification("success", "Task assigned successfully!");
        setTimeout(() => {
          navigate(`/teamlead/project/${projectId}/${teamId}`);
        }, 2000);
      } else {
        showNotification("error", data.assignTaskMember.message || "Failed to assign task");
      }
    },
    onError: () => {
      showNotification("error", "Failed to assign task. Please try again.");
    }
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  // Get AI suggestions when task details change
  const handleGetAISuggestions = () => {
    // Validate all required fields before making AI request
    const missingFields = [];
    
    if (!taskTitle.trim()) {
      missingFields.push("Task Title");
    }
    
    if (!description.trim()) {
      missingFields.push("Description");
    }
    
    if (!priority) {
      missingFields.push("Priority");
    }
    
    if (!dueDate) {
      missingFields.push("Due Date");
    }

    // Show error if any fields are missing
    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      showNotification("error", `Please fill in the following fields first: ${fieldsList}`);
      return;
    }

    // Additional validation: Due date should not be in the past
    if (dueDate && dueDate < today) {
      showNotification("error", "Due date cannot be in the past");
      return;
    }

    // All validations passed, make the AI request
    getSuggestions({
      variables: {
        input: {
          projectId,
          title: taskTitle,
          description: description,
          priority,
          dueDate: dueDate
        }
      }
    });
  };

  const handleSelectSuggestion = (userId) => {
    setAssignedTo(userId);
    setShowAISuggestions(false);
  };

  // Function to handle task creation
  const handleCreateTask = () => {
    if (!taskTitle.trim() || !assignedTo) {
      showNotification("error", "Task title and assigned user are required");
      return;
    }

    // Check if due date is in the past
    if (dueDate && dueDate < today) {
      showNotification("error", "Due date cannot be in the past. Please select a valid date.");
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

  // Helper functions for AI suggestions
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Award className="w-4 h-4" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  // Check field completion status
  const getFieldCompletionStatus = () => {
    return {
      title: !!taskTitle.trim(),
      description: !!description.trim(),
      priority: !!priority,
      dueDate: !!dueDate
    };
  };

  const fieldStatus = getFieldCompletionStatus();
  const allFieldsComplete = Object.values(fieldStatus).every(Boolean);

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-[55]"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div className={`p-4 rounded-xl shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <p className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark transition-colors duration-200">
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Left Column - Main Form */}
              <div className="flex-1 p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-lg border border-bg-accent-light dark:border-bg-accent-dark transition-all duration-200">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                    Create New Task
                  </h2>
                  <p className="text-txt-secondary-light dark:text-txt-secondary-dark font-caption text-lg">
                    AI-powered task assignment for your team members
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
                      Task Description *
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
                        Priority Level *
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
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        min={today}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-4 font-body text-lg bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200"
                      />
                      <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark font-caption">
                        📅 Due date cannot be in the past
                      </p>
                    </div>
                  </div>

                  {/* AI Suggestions Button */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <span className="font-heading font-bold text-txt-primary-light dark:text-txt-primary-dark text-lg">
                          AI-Powered Suggestions
                        </span>
                        {allFieldsComplete && (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <button
                        onClick={handleGetAISuggestions}
                        disabled={!allFieldsComplete || suggestionsLoading}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          !allFieldsComplete || suggestionsLoading
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        {suggestionsLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            Analyzing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Get AI Suggestions
                          </div>
                        )}
                      </button>
                    </div>
                    
                    {/* Field completion checklist */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full ${fieldStatus.title ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className={fieldStatus.title ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                          Title
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full ${fieldStatus.description ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className={fieldStatus.description ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                          Description
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full ${fieldStatus.priority ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className={fieldStatus.priority ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                          Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full ${fieldStatus.dueDate ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        <span className={fieldStatus.dueDate ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                          Due Date
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                      {allFieldsComplete 
                        ? "🚀 All fields complete! Ready for AI analysis of your team members." 
                        : "📝 Complete all fields above to get AI-powered team member recommendations based on skills, workload, and performance."
                      }
                    </p>
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
                          <motion.div 
                            className="p-4 bg-brand-primary-50 dark:bg-brand-primary-900/20 border-2 border-brand-primary-200 dark:border-brand-primary-800 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
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
                          </motion.div>
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

              {/* Right Column - AI Suggestions */}
              <AnimatePresence>
                {showAISuggestions && aiSuggestions && (
                  <motion.div
                    className="w-96 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 300 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-heading text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark">
                          AI Recommendations
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAISuggestions(false)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </button>
                    </div>

                    {/* Best User */}
                    {aiSuggestions.bestUser && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                            Best Match
                          </span>
                        </div>
                        <motion.div
                          className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleSelectSuggestion(aiSuggestions.bestUser.userId)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                                {aiSuggestions.bestUser.username}
                              </h4>
                              <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                                {aiSuggestions.bestUser.role}
                              </span>
                            </div>
                            <div className={`flex items-center gap-1 ${getScoreColor(aiSuggestions.bestUser.score)}`}>
                              {getScoreIcon(aiSuggestions.bestUser.score)}
                              <span className="font-bold text-lg">
                                {Math.round(aiSuggestions.bestUser.score)}
                              </span>
                            </div>
                          </div>

                          {/* Profile Info */}
                          {aiSuggestions.bestUser.profile && (
                            <div className="space-y-2 mb-3">
                              {aiSuggestions.bestUser.profile.GithubUsername && (
                                <div className="flex items-center gap-2">
                                  <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                                    {aiSuggestions.bestUser.profile.GithubUsername}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                                  Workload: {aiSuggestions.bestUser.profile.workload}%
                                </span>
                              </div>
                              {aiSuggestions.bestUser.profile.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {aiSuggestions.bestUser.profile.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                                    >
                                      {skill.name}
                                    </span>
                                  ))}
                                  {aiSuggestions.bestUser.profile.skills.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                      +{aiSuggestions.bestUser.profile.skills.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Reasons */}
                          <div className="space-y-1 mb-3">
                            {aiSuggestions.bestUser.reasons.slice(0, 2).map((reason, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                                  {reason}
                                </span>
                              </div>
                            ))}
                          </div>

                          <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                            Select This Member
                          </button>
                        </motion.div>
                      </div>
                    )}

                    {/* Other Suggestions */}
                    {aiSuggestions.rankedList?.length > 1 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                            Other Options
                          </span>
                        </div>
                        <div className="space-y-3">
                          {aiSuggestions.rankedList.filter(user => user.userId !== aiSuggestions.bestUser?.userId).slice(0, 3).map((user) => (
                            <motion.div
                              key={user.userId}
                              className="bg-white dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                              whileHover={{ scale: 1.01 }}
                              onClick={() => handleSelectSuggestion(user.userId)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark text-sm">
                                  {user.username}
                                </span>
                                <div className={`flex items-center gap-1 ${getScoreColor(user.score)}`}>
                                  <span className="font-bold text-sm">
                                    {Math.round(user.score)}
                                  </span>
                                </div>
                              </div>
                              {user.reasons[0] && (
                                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark truncate">
                                  {user.reasons[0]}
                                </p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark text-center">
                        🤖 AI analyzed skills, workload, and performance to rank your team members
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignTasks;
