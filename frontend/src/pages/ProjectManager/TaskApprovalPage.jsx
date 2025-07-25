import { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { Search, Filter, ChevronDown, CheckCircle, Clock, AlertCircle, Loader, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import TaskList from "../../components/tasks/TaskList";
import TaskDetails from "../../pages/ProjectManager/TaskDetailsManager";
import SkeletonCard from "../../components/UI/SkeletonCard";

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
        attachments {
        name
        size
        type
      }
        dueDate
        createdAt
        updatedAt
        remarks
    }
  }
`;

const FILTER_OPTIONS = [
  { value: "All", label: "All Tasks", icon: FileText, color: "text-gray-500" },
  { value: "To Do", label: "To Do", icon: AlertCircle, color: "text-gray-500" },
  { value: "In Progress", label: "In Progress", icon: Clock, color: "text-blue-500" },
  { value: "Completed", label: "Completed", icon: CheckCircle, color: "text-green-500" },
  { value: "Done", label: "Done", icon: CheckCircle, color: "text-green-500" },
  { value: "Pending Approval", label: "Pending Approval", icon: Clock, color: "text-yellow-500" },
  { value: "Under Review", label: "Under Review", icon: Clock, color: "text-orange-500" },
  { value: "Rejected", label: "Rejected", icon: AlertCircle, color: "text-red-500" },
  { value: "Needs Revision", label: "Needs Revision", icon: AlertCircle, color: "text-yellow-500" },
];

export default function TaskApprovalPage({ projectId }) {
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const managerId = decodedToken.id;

  const { data, loading, error } = useQuery(GET_TASKS_BY_MANAGER, {
    variables: { managerId, projectId },
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (data?.getTasksByManager.length > 0) {
      setSelectedTask(data.getTasksByManager[0]);
    }
  }, [data]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  const filteredTasks = data?.getTasksByManager.filter(
    (task) =>
      (filter === "All" || task.status === filter) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedFilterOption = FILTER_OPTIONS.find(option => option.value === filter);

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Task Approval Center
            </h1>
          </div>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Review, approve, and manage task submissions from your team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Left Panel - Task List */}
          <motion.div
            className="lg:col-span-2 bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Search and Filter Header */}
            <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                  <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark"
                  >
                    <div className="flex items-center gap-2">
                      {selectedFilterOption && (
                        <selectedFilterOption.icon className={`w-4 h-4 ${selectedFilterOption.color}`} />
                      )}
                      <span>{selectedFilterOption?.label || filter}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Animated Dropdown */}
                  <AnimatePresence>
                    {showFilter && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {FILTER_OPTIONS.map((option, index) => (
                          <motion.div
                            key={option.value}
                            onClick={() => {
                              setFilter(option.value);
                              setShowFilter(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark cursor-pointer transition-colors duration-200 font-body text-txt-primary-light dark:text-txt-primary-dark"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <option.icon className={`w-4 h-4 ${option.color}`} />
                            <span>{option.label}</span>
                            {filter === option.value && (
                              <CheckCircle className="w-4 h-4 text-brand-primary-500 ml-auto" />
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results Counter */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="font-body text-brand-primary-500 hover:text-brand-primary-600 transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredTasks.length > 0 ? (
                <TaskList 
                  tasks={filteredTasks} 
                  onSelectTask={setSelectedTask}
                  selectedTaskId={selectedTask?.id}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-brand-primary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                    No Tasks Found
                  </h3>
                  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-md">
                    {searchQuery 
                      ? `No tasks match "${searchQuery}". Try adjusting your search criteria.`
                      : filter !== "All" 
                        ? `No tasks with status "${filter}". Try selecting a different filter.`
                        : "No tasks have been assigned yet. Tasks will appear here once created."
                    }
                  </p>
                  {(searchQuery || filter !== "All") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilter("All");
                      }}
                      className="mt-4 px-4 py-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-lg transition-colors font-body"
                    >
                      Show All Tasks
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Panel - Task Details */}
          <motion.div
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="h-full overflow-y-auto">
              {selectedTask ? (
                <TaskDetails task={selectedTask} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-900/30 dark:to-brand-secondary-800/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-brand-secondary-500" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                    Select a Task
                  </h3>
                  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                    Choose a task from the list to view its details and approval options
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
