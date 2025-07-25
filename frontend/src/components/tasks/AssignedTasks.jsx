import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  User, 
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  Loader,
  RefreshCw
} from "lucide-react";
import CreateTaskModal from "./CreateTasksModal"; // Import the modal

// GraphQL Queries and Mutations
const GET_TASKS_BY_MANAGER = gql`
  query GetTasksByManager($managerId: ID!, $projectId: ID!) {
    getTasksByManager(managerId: $managerId, projectId: $projectId) {
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
      remarks
      assignName
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId)
  }
`;

const priorityOrder = { High: 1, Medium: 2, Low: 3 };
const statusOrder = { Pending: 1, "In Progress": 2, Completed: 3 };

const AssignedTasks = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isDark } = useTheme();

  // Get managerId from token
  const token = localStorage.getItem("token");
  let managerId = null;

  try {
    const decodedToken = token ? jwtDecode(token) : null;
    managerId = decodedToken?.id;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  const shouldSkipQuery = !managerId || !projectId;

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [showCreateModal, setShowCreateModal] = useState(false); // Add create modal state

  // GraphQL operations
  const { data, loading, error, refetch } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
    skip: shouldSkipQuery,
    fetchPolicy: "network-only",
  });

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK);

  // Helper functions
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
      const { data: deleteData } = await deleteTask({ variables: { taskId: taskToDelete.id } });
      if (deleteData.deleteTask) {
        showNotification("success", "Task deleted successfully!");
        refetch();
      } else {
        showNotification("error", "Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotification("error", "An error occurred while deleting the task.");
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleTaskCreated = () => {
    showNotification("success", "Task created successfully!");
    refetch(); // Refresh the tasks list
  };

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
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-brand-primary-500" />
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
            Error Loading Tasks
          </h3>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
            {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  let tasks = data?.getTasksByManager || [];

  // Filter and sort tasks
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortPriority) {
    filteredTasks.sort(
      (a, b) =>
        (sortPriority === "High"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority])
    );
  }

  if (sortStatus) {
    filteredTasks.sort(
      (a, b) =>
        (sortStatus === "Pending"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status])
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateTaskModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleTaskCreated}
          />
        )}
      </AnimatePresence>

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
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
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
                  {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Assigned Tasks
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Manage and track all assigned tasks for this project
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Task
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input
                type="text"
                placeholder="Search tasks..."
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
        </motion.div>

        {/* Tasks Table */}
        <motion.div
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
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
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
                            <User className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
                          </div>
                          <span className="font-body text-txt-primary-light dark:text-txt-primary-dark">
                            {task.assignName || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          <Target className="w-3 h-3" />
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                          <span className="font-body text-txt-primary-light dark:text-txt-primary-dark">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
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
                          <button className="p-2 text-brand-primary-500 hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 rounded-lg transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-brand-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                            No Tasks Found
                          </h3>
                          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                            {searchTerm ? "Try adjusting your search criteria" : "Start by creating your first task"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignedTasks;
