import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {jwtDecode} from "jwt-decode";
import {
  Brain,
  Star,
  TrendingUp,
  Award,
  Target,
  Loader,
  Github,
  Users,
  CheckCircle,
  AlertTriangle,
  X,
  Zap
} from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";


// Your original GraphQL queries and mutations preserved as is:
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
  const { isMobile } = useResponsive();

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
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });

  const [getSuggestions, { loading: suggestionsLoading }] = useLazyQuery(SUGGEST_ASSIGNEES, {
    onCompleted: (data) => {
      setAiSuggestions(data.suggestAssignees);
      console.log("AI Suggestions:", data.suggestAssignees);
      setShowAISuggestions(true);
    },
    onError: (error) => {
      console.error('AI Suggestions Error:', error);
      showNotification("error", "Failed to get AI suggestions");
    }
  });

  const [assignTask, { loading: assignLoading, error: assignError }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTaskMember.success) {
        setShowSuccess(true);
        showNotification("success", "Task assigned successfully!");
        setTimeout(() => {
          setShowSuccess(false);
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

  const uniqueTeamMembers = Array.from(
    new Map((data?.getTeamMembers || []).map((member) => [member.user.email, member])).values()
  );

  const selectedAssignee = uniqueTeamMembers.find(member => member.user.id === assignedTo);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "Medium": return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "Low": return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      default: return "text-txt-secondary-light dark:text-txt-secondary-dark bg-bg-accent-light dark:bg-bg-accent-dark border-gray-200 dark:border-gray-600";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High": return "🔴";
      case "Medium": return "🟡";
      case "Low": return "🟢";
      default: return "⚪";
    }
  };

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

  const handleGetAISuggestions = () => {
    if (uniqueTeamMembers.length === 0) {
      showNotification("error", "No team members found. Please add members first to use AI suggestions.");
      return;
    }

    const missingFields = [];
    if (!taskTitle.trim()) missingFields.push("Task Title");
    if (!description.trim()) missingFields.push("Description");
    if (!priority) missingFields.push("Priority");
    if (!dueDate) missingFields.push("Due Date");
    if (missingFields.length > 0) {
      showNotification("error", `Please fill in the following fields first: ${missingFields.join(", ")}`);
      return;
    }
    if (dueDate && dueDate < today) {
      showNotification("error", "Due date cannot be in the past");
      return;
    }

    getSuggestions({
      variables: {
        input: {
          projectId,
          title: taskTitle,
          description,
          priority,
          dueDate
        }
      }
    });
  };

  const handleSelectSuggestion = (userId) => {
    setAssignedTo(userId);
    setShowAISuggestions(false);
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !assignedTo) {
      showNotification("error", "Task title and assigned user are required");
      return;
    }
    if (dueDate && dueDate < today) {
      showNotification("error", "Due date cannot be in the past");
      return;
    }
    assignTask({
      variables: { projectId, title: taskTitle, description, assignedTo, priority, dueDate }
    });
  };

  const handleCloseAISuggestions = () => {
    setShowAISuggestions(false);
  };

  // Layout classes for responsive design
  const modalMaxWidth = isMobile ? "max-w-full" : "max-w-5xl";
  const aiWidth = isMobile ? "w-full" : "w-96";
  const formWidth = isMobile ? "w-full" : "flex-1";
  const modalPadding = isMobile ? "p-3" : "p-6";

  if (!teamLeadId) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-red-500">
        Error: User not authenticated.
      </div>
    );
  }

  return (
    <>
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-bg-primary-light dark:bg-bg-primary-dark p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 border border-gray-200/20 dark:border-gray-700/20"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Task Assigned Successfully!
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                The task has been assigned to the selected team member.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              notification.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}>
              <p className={`text-sm font-medium ${
                notification.type === "success"
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className={`max-w-7xl mx-auto bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl shadow-lg border border-bg-accent-light dark:border-bg-accent-dark ${modalPadding} ${modalMaxWidth} mx-auto mt-6`}>
        <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
          {/* Form */}
          <div className={`${formWidth} space-y-6`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  Create New Task
                </h2>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                  AI-powered task assignment for your team members
                </p>
              </div>
            </div>

            {/* Task Title */}
            <div>
              <label className="block text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                Task Title *
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive task title..."
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                className="w-full p-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                Description *
              </label>
              <textarea
                rows={isMobile ? 3 : 4}
                placeholder="Provide detailed instructions and requirements for this task..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200 resize-none"
              />
            </div>

            {/* Priority and Due Date */}
            <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-2"} gap-6`}>
              <div>
                <label className="block text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                  Priority Level *
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full p-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200"
                >
                  <option value="Low">🟢 Low Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="High">🔴 High Priority</option>
                </select>
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                    {getPriorityIcon(priority)} {priority} Priority
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  min={today}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full p-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200"
                />
                <p className="text-xs text-txt-muted-light dark:text-txt-muted-dark mt-1">
                  📅 Due date cannot be in the past
                </p>
              </div>
            </div>

            {/* AI Suggestions Button */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                    AI-Powered Suggestions
                  </span>
                </div>
                <button
                  onClick={handleGetAISuggestions}
                  disabled={!taskTitle.trim() || suggestionsLoading || uniqueTeamMembers.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !taskTitle.trim() || suggestionsLoading || uniqueTeamMembers.length === 0
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {suggestionsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Get Suggestions
                    </div>
                  )}
                </button>
              </div>
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                {uniqueTeamMembers.length === 0
                  ? "No team members found. Please add members before using AI suggestions."
                  : "Let AI analyze your task and recommend the best team members based on skills, workload, and performance."}
              </p>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                Assign to Team Member *
              </label>

              {loading ? (
                <div className="flex items-center gap-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200 dark:border-gray-600">
                  <Loader className="w-5 h-5 animate-spin text-brand-primary-500" />
                  <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                    Loading team members...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-body text-red-600 dark:text-red-400">
                    Error loading team members
                  </span>
                </div>
              ) : uniqueTeamMembers.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-body text-yellow-700 dark:text-yellow-300">
                    No team members found. Please add members before assigning tasks.
                  </span>
                </div>
              ) : (
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full p-3 bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-lg focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200"
                >
                  <option value="">Select a team member</option>
                  {uniqueTeamMembers.map((member) => (
                    <option key={member.teamMemberId} value={member.user.id}>
                      {member.user.username} ({member.memberRole}) - {member.user.email}
                    </option>
                  ))}
                </select>
              )}

              {/* Selected Assignee Preview */}
              {selectedAssignee && (
                <motion.div
                  className="mt-4 p-4 bg-brand-primary-50 dark:bg-brand-primary-900/20 border border-brand-primary-200 dark:border-brand-primary-800 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedAssignee.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-brand-primary-700 dark:text-brand-primary-300">
                        {selectedAssignee.user.username}
                      </h4>
                      <p className="text-sm font-caption text-brand-primary-600 dark:text-brand-primary-400">
                        {selectedAssignee.memberRole} • {selectedAssignee.user.email}
                      </p>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300 rounded-full text-xs font-medium">
                        Selected
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error message for assignment failure */}
              {assignError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Failed to assign task. Please check your connection and try again.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-6 border-t border-bg-accent-light dark:border-bg-accent-dark`}>
              <button
                onClick={() => navigate(`/teamlead/project/${projectId}/${teamId}`)}
                className="flex-1 px-8 py-4 font-button font-semibold text-lg text-txt-primary-light dark:text-txt-primary-dark bg-bg-accent-light dark:bg-bg-accent-dark hover:bg-bg-accent-light/80 dark:hover:bg-bg-accent-dark/80 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-txt-muted-light transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                ↩️ Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={assignLoading || !taskTitle.trim() || !assignedTo}
                className="flex-1 px-8 py-4 font-button font-semibold text-lg text-white bg-brand-primary-500 hover:bg-brand-primary-600 disabled:bg-txt-muted-light disabled:cursor-not-allowed rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary-500 shadow-lg hover:shadow-xl"
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
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <AnimatePresence>
            {showAISuggestions && aiSuggestions && (
              <motion.div
                className={`${aiWidth} bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mt-6 sm:mt-0 sm:ml-6 shrink-0`}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-heading text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark">
                    AI Recommendations
                  </h3>
                  <button
                    onClick={handleCloseAISuggestions}
                    className="ml-auto p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                    aria-label="Close AI Suggestions"
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
                          <span className="font-bold text-lg">{Math.round(aiSuggestions.bestUser.score)}</span>
                        </div>
                      </div>

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
                              {aiSuggestions.bestUser.profile.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
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
                      <div className="space-y-1">
                        {aiSuggestions.bestUser.reasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                        Select This User
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
                      {aiSuggestions.rankedList
                        .filter(user => user.userId !== aiSuggestions.bestUser?.userId)
                        .slice(0, 3)
                        .map(user => (
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
                                <span className="font-bold text-sm">{Math.round(user.score)}</span>
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

                <button
                  onClick={handleCloseAISuggestions}
                  className="w-full mt-4 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close Suggestions
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AssignTasks;
