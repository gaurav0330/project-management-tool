import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTasks, 
  FaClipboardCheck, 
  FaSpinner, 
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaEye,
  FaRedo 
} from "react-icons/fa";
import TaskList from "./TaskList";
import TaskDetails from "./TaskDetiledLead";

const GET_TASKS_FOR_LEAD = gql`
  query GetTasksForLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksForLead(teamLeadId: $teamLeadId, projectId: $projectId) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

const getTeamLeadIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function TaskSubmissionPage({ projectId }) {
  const { isDark } = useTheme();
  const teamLeadId = getTeamLeadIdFromToken();
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const { loading, error, data, refetch } = useQuery(GET_TASKS_FOR_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
    fetchPolicy: "cache-and-network",
  });

  const [updateTaskStatus, { loading: updateLoading }] = useMutation(UPDATE_TASK_STATUS);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleStatusChange = (status) => {
    if (!isCompleted) {
      setTaskStatus(status);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedTask) return;

    try {
      const { data } = await updateTaskStatus({
        variables: { taskId: selectedTask.id, status: "Done" },
      });

      if (data.updateTaskStatus.success) {
        setIsCompleted(true);
        showNotification("success", "Task marked as completed successfully!");
        refetch();
      } else {
        showNotification("error", data.updateTaskStatus.message || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      showNotification("error", "An error occurred while updating task status");
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setTaskStatus(task.status);
    setIsCompleted(task.status === "Done");
  };

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Pending': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Filter tasks based on search and status
  const filteredTasks = (data?.getTasksForLead || []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <FaSpinner className="w-8 h-8 text-brand-primary-500 animate-spin" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-brand-primary-200 dark:border-brand-primary-800 rounded-full animate-pulse"></div>
            </div>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
              Loading tasks...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !teamLeadId) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              {!teamLeadId ? "Unauthorized Access" : "Error Loading Tasks"}
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
              {!teamLeadId ? "No valid authentication token found." : error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <FaRedo className="w-4 h-4" />
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-50"
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

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaClipboardCheck className="w-5 h-5 text-white" />
                </div>
                Task Management
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Review, update, and manage your assigned tasks
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <FaRedo  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Task Statistics */}
        <motion.div
          className="mt-8 bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4">
            Task Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Total Tasks",
                value: data?.getTasksForLead?.length || 0,
                icon: FaTasks,
                color: "blue",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Pending",
                value: data?.getTasksForLead?.filter(t => t.status === "Pending").length || 0,
                icon: FaClock,
                color: "gray",
                gradient: "from-gray-500 to-gray-600"
              },
              {
                title: "In Progress",
                value: data?.getTasksForLead?.filter(t => t.status === "In Progress").length || 0,
                icon: FaFlag,
                color: "yellow",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                title: "Completed",
                value: data?.getTasksForLead?.filter(t => t.status === "Done").length || 0,
                icon: FaCheckCircle,
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                      {stat.value}
                    </p>
                    <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Search and Filter Bar */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Completed</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Task List Panel */}
          <motion.div
            className="lg:col-span-4 bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaTasks className="w-5 h-5 text-brand-primary-500" />
                <h2 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                  Task List
                </h2>
              </div>
              
              <TaskList 
                tasks={filteredTasks} 
                onSelectTask={handleTaskSelect}
                selectedTask={selectedTask}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
              />
            </div>
          </motion.div>

          {/* Task Details Panel */}
          <motion.div
            className="lg:col-span-8 bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                {selectedTask ? (
                  <motion.div
                    key="task-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TaskDetails
                      selectedTask={selectedTask}
                      taskStatus={taskStatus}
                      isCompleted={isCompleted}
                      handleStatusChange={handleStatusChange}
                      handleMarkAsDone={handleMarkAsDone}
                      files={files}
                      setFiles={setFiles}
                      updateLoading={updateLoading}
                      getPriorityColor={getPriorityColor}
                      getStatusColor={getStatusColor}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaEye className="w-10 h-10 text-brand-primary-500" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-3">
                      Select a Task
                    </h3>
                    <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-md mx-auto">
                      Choose a task from the list on the left to view its details, update status, and manage submissions.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
