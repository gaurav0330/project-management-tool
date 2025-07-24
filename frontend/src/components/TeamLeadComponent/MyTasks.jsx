import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { 
  FaSearch, 
  FaPlus, 
  FaTasks, 
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaEye,
  FaSortAmountDown,
  FaFilter,
  FaUser,
  FaProjectDiagram,
  FaBullseye,
  FaFlag
} from "react-icons/fa";

// GraphQL Query for fetching tasks assigned to a Team Lead
const GET_TASKS_FOR_LEAD = gql`
  query GetTasksForLead($teamLeadId: ID!) {
    getTasksForLead(teamLeadId: $teamLeadId) {
      id
      title
      description
      project
      createdBy
      assignedTo
      status
      priority
      dueDate
      assignName
      createdAt
      attachments
      updatedAt
      remarks
    }
  }
`;

const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };

const MyTasks = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");
  let teamLeadId = null;

  try {
    const decodedToken = token ? jwtDecode(token) : null;
    teamLeadId = decodedToken?.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  const shouldSkipQuery = !teamLeadId;
  const { data, loading, error, refetch } = useQuery(GET_TASKS_FOR_LEAD, {
    variables: { teamLeadId },
    skip: shouldSkipQuery,
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or cards

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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <FaFlag className="w-3 h-3" />;
      case 'Medium': return <FaBullseye className="w-3 h-3" />;
      case 'Low': return <FaBullseye className="w-3 h-3" />;
      default: return <FaBullseye className="w-3 h-3" />;
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
              Loading your tasks...
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
              className="btn-primary"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  let tasks = data?.getTasksForLead || [];

  // Filtering by search term
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting by priority
  if (sortPriority) {
    filteredTasks.sort((a, b) =>
      sortPriority === "High"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  }

  // Sorting by status
  if (sortStatus) {
    filteredTasks.sort((a, b) =>
      sortStatus === "Completed"
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status]
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
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
                My Tasks
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Track and manage your assigned tasks
              </p>
            </div>
            
            <motion.button
              onClick={() => navigate('/create-task')}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="w-4 h-4" />
              Add New Task
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Controls Bar */}
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

            {/* Priority Filter */}
            <select
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
              onChange={(e) => setSortPriority(e.target.value)}
              value={sortPriority}
            >
              <option value="">Sort by Priority</option>
              <option value="High">High → Low</option>
              <option value="Low">Low → High</option>
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
              onChange={(e) => setSortStatus(e.target.value)}
              value={sortStatus}
            >
              <option value="">Sort by Status</option>
              <option value="Pending">Pending → Completed</option>
              <option value="Completed">Completed → Pending</option>
            </select>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <span className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Filtered & Sorted
              </span>
            </div>
          </div>
        </motion.div>

        {/* Task Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: "Total Tasks",
              value: tasks.length,
              icon: FaTasks,
              color: "blue",
              gradient: "from-blue-500 to-blue-600"
            },
            {
              title: "Pending",
              value: tasks.filter(t => t.status === "Pending").length,
              icon: FaClock,
              color: "gray",
              gradient: "from-gray-500 to-gray-600"
            },
            {
              title: "In Progress",
              value: tasks.filter(t => t.status === "In Progress").length,
              icon: FaProjectDiagram,
              color: "yellow",
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              title: "Completed",
              value: tasks.filter(t => t.status === "Completed").length,
              icon: FaCheckCircle,
              color: "green",
              gradient: "from-green-500 to-emerald-500"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.3 + index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white text-lg" />
                </div>
                <div className="text-right">
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
        </motion.div>

        {/* Tasks Table/Cards */}
        <AnimatePresence mode="wait">
          {filteredTasks.length > 0 ? (
            <motion.div
              key="tasks-content"
              className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-accent-light dark:bg-bg-accent-dark border-b border-gray-200/20 dark:border-gray-700/20">
                    <tr>
                      <th className="text-left p-4 font-heading font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                        Task
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
                    {filteredTasks.map((task, index) => (
                      <motion.tr
                        key={task.id}
                        className="border-b border-gray-200/20 dark:border-gray-700/20 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-colors duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-body font-medium text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
                              {task.title}
                              {isOverdue(task.dueDate) && (
                                <span className="text-red-500 text-xs">⚠️ Overdue</span>
                              )}
                            </p>
                            {task.description && (
                              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
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
                              className="p-2 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaEdit className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
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
                  {searchTerm ? "No Tasks Found" : "No Tasks Yet"}
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                  {searchTerm 
                    ? `No tasks match your search "${searchTerm}". Try adjusting your search terms.`
                    : "You don't have any assigned tasks yet. Tasks will appear here when they're assigned to you."
                  }
                </p>
                {!searchTerm && (
                  <motion.button
                    onClick={() => navigate('/tasks')}
                    className="btn-primary flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTasks className="w-4 h-4" />
                    Browse All Tasks
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTasks;
