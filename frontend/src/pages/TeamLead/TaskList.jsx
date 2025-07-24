import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  FaSearch, 
  FaFilter, 
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFlag,
  FaBullseye,
  FaEye,
  FaSpinner
} from "react-icons/fa";

export default function TaskList({ 
  tasks, 
  onSelectTask, 
  selectedTask, 
  getPriorityColor, 
  getStatusColor 
}) {
  const { isDark } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState(selectedTask?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);
    onSelectTask(task);
  };

  // Helper functions for status and priority colors
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
      case 'Completed': 
        return <FaCheckCircle className="w-4 h-4" />;
      case 'In Progress': 
        return <FaClock className="w-4 h-4" />;
      case 'Pending':
      case 'To Do': 
        return <FaExclamationTriangle className="w-4 h-4" />;
      default: 
        return <FaClock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <FaFlag className="w-3 h-3 text-red-500" />;
      case 'Medium': return <FaBullseye className="w-3 h-3 text-yellow-500" />;
      case 'Low': return <FaBullseye className="w-3 h-3 text-green-500" />;
      default: return <FaBullseye className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = () => {
    let filtered = tasks || [];

    if (filter !== "All") {
      filtered = filtered.filter((task) => task.status === filter);
    }

    return filtered.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTaskCount = (status) => {
    if (status === "All") return tasks?.length || 0;
    return tasks?.filter(task => task.status === status).length || 0;
  };

  const processedTasks = filteredTasks();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTasks className="w-5 h-5 text-brand-primary-500" />
          <h2 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
            Task List
          </h2>
          <span className="bg-brand-primary-100 dark:bg-brand-primary-900/30 text-brand-primary-700 dark:text-brand-primary-300 px-2 py-1 rounded-full text-xs font-medium">
            {processedTasks.length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-6">
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 appearance-none"
          >
            <option value="All">All Tasks ({getTaskCount("All")})</option>
            <option value="To Do">To Do ({getTaskCount("To Do")})</option>
            <option value="In Progress">In Progress ({getTaskCount("In Progress")})</option>
            <option value="Completed">Completed ({getTaskCount("Completed")})</option>
            <option value="Done">Done ({getTaskCount("Done")})</option>
            <option value="Pending Approval">Pending Approval ({getTaskCount("Pending Approval")})</option>
            <option value="Under Review">Under Review ({getTaskCount("Under Review")})</option>
            <option value="Rejected">Rejected ({getTaskCount("Rejected")})</option>
            <option value="Needs Revision">Needs Revision ({getTaskCount("Needs Revision")})</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 pb-4 border-b border-gray-200/20 dark:border-gray-700/20">
        <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          Showing {processedTasks.length} of {tasks?.length || 0} tasks
          {filter !== "All" && ` · Filtered by ${filter}`}
          {searchTerm && ` · Searching "${searchTerm}"`}
        </p>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {processedTasks.length > 0 ? (
            <motion.div
              key="task-list"
              className="h-full overflow-y-auto pr-2 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {processedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                    selectedTaskId === task.id 
                      ? "bg-brand-primary-50 dark:bg-brand-primary-900/20 border-brand-primary-300 dark:border-brand-primary-700 shadow-md" 
                      : "bg-bg-accent-light dark:bg-bg-accent-dark hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark border-gray-200/50 dark:border-gray-700/50 hover:border-brand-primary-300 dark:hover:border-brand-primary-700"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selected Indicator */}
                  {selectedTaskId === task.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary-500 rounded-l-xl"></div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Task Title */}
                      <h3 className={`font-body font-semibold mb-2 line-clamp-2 ${
                        selectedTaskId === task.id 
                          ? "text-brand-primary-700 dark:text-brand-primary-300" 
                          : "text-txt-primary-light dark:text-txt-primary-dark group-hover:text-brand-primary-600 dark:group-hover:text-brand-primary-400"
                      }`}>
                        {task.title}
                      </h3>

                      {/* Task Meta Info */}
                      <div className="flex items-center gap-4 mb-3">
                        {/* Due Date */}
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3 text-txt-secondary-light dark:text-txt-secondary-dark" />
                          <span className={`text-xs font-medium ${
                            isOverdue(task.dueDate) 
                              ? 'text-red-500' 
                              : 'text-txt-secondary-light dark:text-txt-secondary-dark'
                          }`}>
                            {formatDate(task.dueDate)}
                            {isOverdue(task.dueDate) && ' (Overdue)'}
                          </span>
                        </div>

                        {/* Priority */}
                        {task.priority && (
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(task.priority)}
                            <span className="text-xs font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                              {task.priority}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description Preview */}
                      {task.description && (
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        getStatusColor ? getStatusColor(task.status) : 
                        task.status === "Done" || task.status === "Completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                        task.status === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                        task.status === "Needs Revision" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>

                      {/* View Icon for Selected Task */}
                      {selectedTaskId === task.id && (
                        <motion.div
                          className="w-6 h-6 bg-brand-primary-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <FaEye className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-200 ${
                    selectedTaskId === task.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                  } bg-gradient-to-r from-brand-primary-500/5 to-brand-secondary-500/5 pointer-events-none`}></div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              className="flex flex-col items-center justify-center h-full py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mb-4">
                <FaTasks className="w-8 h-8 text-brand-primary-500" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                {searchTerm || filter !== "All" ? "No Tasks Found" : "No Tasks Available"}
              </h3>
              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark text-center max-w-xs">
                {searchTerm 
                  ? `No tasks match "${searchTerm}". Try adjusting your search.`
                  : filter !== "All" 
                    ? `No tasks with "${filter}" status found.`
                    : "Tasks will appear here when they're assigned to you."
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
