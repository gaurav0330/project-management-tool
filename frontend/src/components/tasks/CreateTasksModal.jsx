import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  User, 
  FileText, 
  Target,
  Loader,
  Send,
  Users,
  Clock,
  Mail,
  UserCheck,
  X,
  Brain,
  Star,
  TrendingUp,
  Award,
  Zap,
  Github
} from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";


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

// GraphQL Query for AI suggestions
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


// ...[Your GraphQL queries and mutations remain unchanged]...

const CreateTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const { projectId } = useParams();
  const { isDark } = useTheme();
  const { breakpoint, width, isMobile, isTablet } = useResponsive();

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Responsive styles
  const layoutDirection = isMobile ? "flex-col" : "flex-row";
  const aiWidth = isMobile ? "w-full" : "w-96";
  const formWidth = isMobile ? "w-full" : "flex-1";
  const modalPadding = isMobile ? "p-3" : "p-6";
  const modalMaxWidth = isMobile ? "max-w-full" : "max-w-5xl";

  // Today's date for input min validation
  const today = new Date().toISOString().split('T')[0];

  // Fetch team leads based on project ID (only when modal is open)
  const { data, loading, error } = useQuery(GET_LEADS_BY_PROJECT_ID, {
    variables: { projectId },
    skip: !isOpen,
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

  // Remove duplicate leads
  const uniqueTeamLeads = Array.from(
    new Map(
      (data?.getLeadsByProjectId?.teamLeads || []).map((lead) => [lead.teamLeadId, lead])
    ).values()
  );

  // Find selected assignee details
  const selectedAssignee = uniqueTeamLeads.find(lead => lead.teamLeadId === assignedTo);

  // Use Mutation Hook
  const [assignTask, { loading: assignLoading }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTask.success) {
        setShowSuccess(true);
        showNotification("success", "Task assigned successfully!");
        resetForm();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        showNotification("error", data.assignTask.message || "Failed to assign task");
      }
    },
    onError: () => {
      showNotification("error", "Failed to assign task. Please try again.");
    },
  });

  const resetForm = () => {
    setTaskTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssignedTo("");
    setShowAISuggestions(false);
    setAiSuggestions(null);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  // Get AI suggestions when task details change
  const handleGetAISuggestions = () => {
    if (uniqueTeamLeads.length === 0) {
      showNotification("error", "Please add team leads first before getting AI suggestions.");
      return;
    }
    const missingFields = [];
    if (!taskTitle.trim()) missingFields.push("Task Title");
    if (!description.trim()) missingFields.push("Description");
    if (!priority) missingFields.push("Priority");
    if (!dueDate) missingFields.push("Due Date");
    // Show error if any fields are missing
    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      showNotification("error", `Please fill in the following fields first: ${fieldsList}`);
      return;
    }
    // Due date should not be in the past
    if (dueDate && dueDate < today) {
      showNotification("error", "Due date cannot be in the past");
      return;
    }
    getSuggestions({
      variables: {
        input: {
          projectId,
          title: taskTitle,
          description: description || "",
          priority,
          dueDate: dueDate || undefined
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'Low': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'text-txt-secondary-light dark:text-txt-secondary-dark bg-bg-accent-light dark:bg-bg-accent-dark border-gray-200 dark:border-gray-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
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

  if (!isOpen) return null;
  
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
                Task Created Successfully!
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                The task has been assigned to the team lead
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

      {/* Main Modal */}
      <motion.div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 ${isMobile ? 'items-end' : 'items-center'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className={`bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl shadow-2xl ${modalMaxWidth} w-full max-h-[95vh] overflow-y-auto border border-gray-200/20 dark:border-gray-700/20 ${modalPadding}`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          style={{ width: isMobile ? "100%" : undefined, margin: isMobile ? "0" : undefined}}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  Create New Task
                </h2>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                  AI-powered task assignment for optimal team performance
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            </button>
          </div>

          {/* Layout: Responsive Columns */}
          <div className={`flex gap-6 ${layoutDirection}`}>
            {/* Left - Form */}
            <div className={`${formWidth} space-y-6`}>
              {/* Task Title */}
              <div>
                <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                  <FileText className="w-4 h-4 text-brand-primary-500" />
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                  <FileText className="w-4 h-4 text-brand-primary-500" />
                  Description
                </label>
                <textarea
                  placeholder="Describe the task in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 resize-none"
                />
              </div>

              {/* Priority and Due Date */}
              <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-2"} gap-6`}>
                <div>
                  <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                    <Target className="w-4 h-4 text-brand-primary-500" />
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
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
                  <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                    <Calendar className="w-4 h-4 text-brand-primary-500" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    min={today}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                  />
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
                    disabled={!taskTitle.trim() || suggestionsLoading || uniqueTeamLeads.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      !taskTitle.trim() || suggestionsLoading || uniqueTeamLeads.length === 0
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
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
                  {uniqueTeamLeads.length === 0 
                    ? "No team leads found. Please add at least one team lead before using AI suggestions."
                    : "Let AI analyze your task and recommend the best team leads based on skills, workload, and performance."
                  }
                </p>
              </div>

              {/* Manual Assignment */}
              <div>
                <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                  <User className="w-4 h-4 text-brand-primary-500" />
                  Assign to Team Lead *
                </label>

                {loading ? (
                  <div className="flex items-center gap-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200 dark:border-gray-600">
                    <Loader className="w-5 h-5 animate-spin text-brand-primary-500" />
                    <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">Loading team leads...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-body text-red-600 dark:text-red-400">Error loading team leads</span>
                  </div>
                ) : uniqueTeamLeads.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="font-body text-yellow-700 dark:text-yellow-300">
                      No team leads found. Please add team leads before creating a task.
                    </span>
                  </div>
                ) : (
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                  >
                    <option value="">Select Team Lead</option>
                    {uniqueTeamLeads.map((lead) => (
                      <option key={lead.teamLeadId} value={lead.teamLeadId}>
                        {lead.user.username} ({lead.leadRole})
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
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-full flex items-center justify-center text-white">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
                          <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                            {selectedAssignee.user.username}
                          </span>
                          <span className="px-2 py-1 bg-brand-primary-100 dark:bg-brand-primary-800/30 text-brand-primary-700 dark:text-brand-primary-300 text-xs rounded-full font-medium">
                            {selectedAssignee.leadRole}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                          <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                            {selectedAssignee.user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 flex-col sm:flex-row">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleCreateTask}
                  disabled={assignLoading || !taskTitle.trim() || !assignedTo}
                  className={`w-full sm:w-auto flex items-center justify-center gap-3 py-3 rounded-xl font-button font-medium transition-all duration-200 ${
                    assignLoading || !taskTitle.trim() || !assignedTo
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={!assignLoading && taskTitle.trim() && assignedTo ? { scale: 1.02 } : {}}
                  whileTap={!assignLoading && taskTitle.trim() && assignedTo ? { scale: 0.98 } : {}}
                >
                  {assignLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating Task...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Create & Assign Task
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Right - AI Suggestions (hidden on small if not open) */}
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
                  </div>
                  {/* ...The AI suggestions UI remains unchanged... */}
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
                          <div className="space-y-1">
                            {aiSuggestions.bestUser.reasons.slice(0, 2).map((reason, index) => (
                              <div key={index} className="flex items-start gap-2">
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

                    <button
                      onClick={() => setShowAISuggestions(false)}
                      className="w-full mt-4 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close Suggestions
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CreateTaskModal;
