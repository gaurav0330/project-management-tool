import { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { Search, Filter, ChevronDown, X, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "../../components/tasks/TaskList";
import TaskDetails from "../../components/tasks/TaskDetails";

const GET_TASKS_BY_TEAM_LEAD = gql`
  query GetTasksByTeamLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksByTeamLead(teamLeadId: $teamLeadId, projectId: $projectId) {
      id
      title
      description
      assignedTo
      status
      priority
      dueDate
      createdAt
      assignName
      attachments {
        name
        size
        type
      }
      updatedAt
      remarks
    }
  }
`;

const FILTER_OPTIONS = [
  { value: "All", label: "All Tasks", icon: "📋" },
  { value: "To Do", label: "To Do", icon: "📝" },
  { value: "In Progress", label: "In Progress", icon: "🔄" },
  { value: "Completed", label: "Completed", icon: "✅" },
  { value: "Done", label: "Done", icon: "🎉" },
  { value: "Pending Approval", label: "Pending Approval", icon: "⏳" },
  { value: "Under Review", label: "Under Review", icon: "👀" },
  { value: "Rejected", label: "Rejected", icon: "❌" },
  { value: "Needs Revision", label: "Needs Revision", icon: "🔧" },
];

export default function TaskApprovalPage({ projectId }) {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const teamLeadId = decodedToken.id;

  const { data, loading, error, refetch } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
    errorPolicy: 'all'
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null); 

  // Hiiihih

  useEffect(() => {
    if (data?.getTasksByTeamLead.length > 0) {
      setSelectedTask(data.getTasksByTeamLead[0]);
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

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-brand-primary-500 animate-spin" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark">
              Loading Tasks...
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
              Please wait while we fetch your team's tasks
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-screen bg-bg-primary-light dark:bg-bg-primary-dark">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            className="text-center space-y-6 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto bg-error/10 dark:bg-error/20 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-error" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Failed to Load Tasks
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
                {error.message || "Something went wrong while loading your tasks"}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 font-button font-semibold text-white bg-brand-primary-500 hover:bg-brand-primary-600 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark transform hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const filteredTasks = data?.getTasksByTeamLead?.filter(
    (task) =>
      (filter === "All" || task.status === filter) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedFilterOption = FILTER_OPTIONS.find(option => option.value === filter);

  return (
    <div className="flex h-screen p-6 bg-bg-primary-light dark:bg-bg-primary-dark gap-6 transition-colors duration-200">
      {/* Left Panel - Task List */}
      <motion.div
        className="w-2/3 flex flex-col bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-bg-accent-light dark:border-bg-accent-dark bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                Task Management
              </h1>
              <p className="font-caption text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                Monitor and approve team tasks
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark bg-bg-accent-light dark:bg-bg-accent-dark px-3 py-1 rounded-full">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
              </span>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" />
              <input
                type="text"
                placeholder="Search tasks by title, assignee, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 font-body bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-txt-muted-light dark:text-txt-muted-dark" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full p-3 flex items-center justify-between font-body bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" />
                  <span className="font-medium">
                    {selectedFilterOption?.icon} {selectedFilterOption?.label}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
              </button>

              {/* Animated Dropdown */}
              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    className="absolute left-0 w-full mt-2 bg-bg-primary-light dark:bg-bg-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-xl shadow-2xl z-20 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, type: "spring" }}
                  >
                    {FILTER_OPTIONS.map((option, index) => (
                      <motion.div
                        key={option.value}
                        onClick={() => {
                          setFilter(option.value);
                          setShowFilter(false);
                        }}
                        className={`p-3 font-body cursor-pointer transition-all duration-200 flex items-center space-x-3 ${
                          filter === option.value 
                            ? 'bg-brand-primary-50 dark:bg-brand-primary-900/20 text-brand-primary-600 dark:text-brand-primary-400 font-semibold' 
                            : 'text-txt-primary-light dark:text-txt-primary-dark hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark'
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                        {filter === option.value && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-brand-primary-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <TaskList 
            tasks={filteredTasks} 
            onSelectTask={setSelectedTask} 
            selectedTaskId={selectedTask?.id}
          />
        </div>
      </motion.div>

      {/* Right Panel - Task Details */}
      <motion.div
        className="w-1/3 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark overflow-hidden flex flex-col"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Details Header */}
        <div className="p-6 border-b border-bg-accent-light dark:border-bg-accent-dark bg-gradient-to-r from-brand-secondary-50 to-brand-primary-50 dark:from-brand-secondary-900/20 dark:to-brand-primary-900/20">
          <h2 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Task Details
          </h2>
          <p className="font-caption text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
            {selectedTask ? 'Review and manage task' : 'Select a task to view details'}
          </p>
        </div>

        {/* Task Details Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedTask ? (
            <TaskDetails task={selectedTask} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-2xl flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Search className="w-8 h-8 text-brand-primary-500" />
              </motion.div>
              <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                No Task Selected
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-sm">
                Click on any task from the left panel to view its details, attachments, and manage its status
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
