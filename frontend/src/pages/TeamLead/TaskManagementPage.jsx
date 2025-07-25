import React, { useState, useEffect } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTasks, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaComment,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaCalendarAlt,
  FaUser,
  FaFilter,
  FaSortAmountDown,
  FaRedo 
} from "react-icons/fa";

const GET_TASKS_BY_TEAM_LEAD = gql`
  query GetTasksByTeamLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksByTeamLead(teamLeadId: $teamLeadId, projectId: $projectId) {
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
      attachments {
        name
        size
        type
      }
      updatedAt
      assignName
      remarks
    }
  }
`


const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

const TaskManagementPage = ({ projectId }) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [teamLeadId, setTeamLeadId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeamLeadId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
    fetchPolicy: "cache-and-network",
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleDeleteTask = async (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const { data: deleteData } = await deleteTask({ 
        variables: { taskId: taskToDelete.id }
      });

      if (deleteData.deleteTask) {
        showNotification("success", "Task deleted successfully!");
        refetch();
      } else {
        showNotification("error", "Failed to delete task.");
      }
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      showNotification("error", "An error occurred while deleting the task.");
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleEditTask = (task) => {
    // Navigate to edit page or open edit modal
    console.log("Edit task:", task.id);
    showNotification("info", "Edit functionality to be implemented");
  };

  const handleCommentTask = (task) => {
    // Open comment modal or navigate to task details
    console.log("Comment on task:", task.id);
    showNotification("info", "Comment functionality to be implemented");
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
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Pending': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'In Progress': return <FaClock className="w-4 h-4" />;
      case 'Pending': return <FaExclamationTriangle className="w-4 h-4" />;
      default: return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Filter and sort tasks
  const processedTasks = React.useMemo(() => {
    if (!data?.getTasksByTeamLead) return [];

    let filtered = data.getTasksByTeamLead.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.assignName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        case 'priority':
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchQuery, statusFilter, priorityFilter, sortBy]);

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

  if (error) {
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
              Error Loading Tasks
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
              {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <FaRedo  className="w-4 h-4" />
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Delete Task
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaTrash className="w-4 h-4" />}
                  Delete
                </button>
              </div>
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
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
            }`}>
              <p className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : notification.type === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : 'text-blue-800 dark:text-blue-200'
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
                  <FaTasks className="w-5 h-5 text-white" />
                </div>
                Task Management
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Manage and organize all your team tasks
              </p>
            </div>
            
            {/* <motion.button
              onClick={() => showNotification("info", "Add task functionality to be implemented")}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="w-4 h-4" />
              Add New Task
            </motion.button> */}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input
                type="text"
                placeholder="Search tasks or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
            >
              <option value="All">All Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Showing {processedTasks.length} of {data?.getTasksByTeamLead?.length || 0} tasks
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaSortAmountDown className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm bg-transparent border-none focus:outline-none text-txt-secondary-light dark:text-txt-secondary-dark"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tasks Table */}
        <AnimatePresence mode="wait">
          {processedTasks.length > 0 ? (
            <motion.div
              key="tasks-table"
              className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-accent-light dark:bg-bg-accent-dark border-b border-gray-200/20 dark:border-gray-700/20">
                    <tr>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Task
                      </th>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Assigned To
                      </th>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Priority
                      </th>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Due Date
                      </th>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Status
                      </th>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedTasks.map((task, index) => (
                      <motion.tr
                        key={task.id}
                        className="border-b border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-colors duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-body font-medium text-txt-primary-light dark:text-txt-primary-dark">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
                            </div>
                            <span className="font-body text-txt-primary-light dark:text-txt-primary-dark">
                              {task.assignName || "Unassigned"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            <FaFlag className="w-3 h-3" />
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                            <span className={`font-body text-txt-primary-light dark:text-txt-primary-dark ${
                              isOverdue(task.dueDate) ? 'text-red-500 font-semibold' : ''
                            }`}>
                              {formatDate(task.dueDate)}
                              {isOverdue(task.dueDate) && (
                                <span className="text-red-500 text-xs ml-1">⚠️</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <motion.button 
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEdit className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              onClick={() => handleCommentTask(task)}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaComment className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              onClick={() => handleDeleteTask(task)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaTrash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaTasks className="w-10 h-10 text-brand-primary-500" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-3">
                  No Tasks Found
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                  {searchQuery || statusFilter !== "All" || priorityFilter !== "All"
                    ? "No tasks match your current filters. Try adjusting your search criteria."
                    : "You don't have any tasks yet. Create your first task to get started."
                  }
                </p>
                <motion.button
                  onClick={() => showNotification("info", "Add task functionality to be implemented")}
                  className="btn-primary flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="w-4 h-4" />
                  Create First Task
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskManagementPage;