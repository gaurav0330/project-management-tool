import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";
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
  UserCheck
} from "lucide-react";

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
  const { isDark } = useTheme();

  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

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

  // Find selected assignee details
  const selectedAssignee = uniqueTeamLeads.find(lead => lead.teamLeadId === assignedTo);

  // Use Mutation Hook
  const [assignTask, { loading: assignLoading }] = useMutation(ASSIGN_TASK, {
    onCompleted: (data) => {
      if (data.assignTask.success) {
        setShowSuccess(true);
        showNotification("success", "Task assigned successfully!");
        // Reset form
        setTaskTitle("");
        setDescription("");
        setPriority("Low");
        setDueDate("");
        setAssignedTo("");
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        showNotification("error", data.assignTask.message || "Failed to assign task");
      }
    },
    onError: () => {
      showNotification("error", "Failed to assign task. Please try again.");
    },
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !assignedTo) {
      showNotification("error", "Task title and assigned user are required");
      return;
    }

    // Validate due date is not in the past
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

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
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
            className="fixed top-4 right-4 z-40"
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

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Create New Task
            </h1>
          </div>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Assign tasks to team leads and track project progress
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="p-8">
            <div className="space-y-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  {/* Priority Preview */}
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
                    min={today} // ✅ Prevent past dates
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                  />
                  <p className="mt-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Select a future date for the task deadline
                  </p>
                </div>
              </div>

              {/* Assign To */}
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
                ) : (
                  <>
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

                    {/* ✅ Selected Assignee Preview */}
                    {selectedAssignee && (
                      <motion.div 
                        className="mt-4 p-4 bg-brand-primary-50 dark:bg-brand-primary-900/20 border border-brand-primary-200 dark:border-brand-primary-800 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
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
                  </>
                )}

                {uniqueTeamLeads.length === 0 && !loading && !error && (
                  <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="font-body text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          No Team Leads Available
                        </p>
                        <p className="font-body text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                          Please assign team leads to this project first
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <motion.button
                  onClick={handleCreateTask}
                  disabled={assignLoading || !taskTitle.trim() || !assignedTo}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-button font-medium transition-all duration-200 ${
                    assignLoading || !taskTitle.trim() || !assignedTo
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignTasks;
