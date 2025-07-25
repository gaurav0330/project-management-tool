import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Search, X, Calendar, User, Flag, Clock, ArrowRight, Filter, SortDesc, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 GraphQL Query to Fetch Tasks
const GET_TASKS_FOR_MEMBER = gql`
  query GetTasksForMember($memberId: ID!, $projectId: ID!) {
    getTasksForMember(memberId: $memberId, projectId: $projectId) {
      id
      title
      description
      createdBy
      priority
      status
      dueDate
      createdAt

    }
  }
`;

// 🔹 GraphQL Query to Fetch User Details
const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

// 🔹 Extract memberId from JWT token
const getMemberIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.id;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

// Component to display user information
const UserDisplay = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId, // Skip query if no userId provided
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader className="w-3 h-3 animate-spin text-brand-primary-500" />
        <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          Loading...
        </span>
      </div>
    );
  }

  if (error || !data?.getUser) {
    return (
      <span className="text-sm">
        {userId} {/* Fallback to showing the ID if user fetch fails */}
      </span>
    );
  }

  return (
    <span className="text-sm">
      {data.getUser.username}
    </span>
  );
};

// Task Card Component
const TaskCard = ({ task, index, projectId, navigate }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "from-red-500 to-red-600";
      case "Medium": return "from-yellow-500 to-yellow-600";
      case "Low": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && 
                   task.status !== "Done" && task.status !== "Completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Priority Strip */}
      <div className={`h-1 bg-gradient-to-r ${getPriorityColor(task.priority)}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2 line-clamp-2">
              {task.title}
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm line-clamp-3">
              {task.description}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            <Flag className="w-4 h-4" />
            <span className="font-medium">Priority:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
              {task.priority}
            </span>
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-3 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-txt-secondary-light dark:text-txt-secondary-dark'}`}>
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Due:</span>
              <span className={isOverdue ? 'font-semibold' : ''}>
                {new Date(task.dueDate).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
          )}

          {/* Updated Assigned By section */}
          {task.createdBy && (
            <div className="flex items-center gap-3 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              <User className="w-4 h-4" />
              <span className="font-medium">Assigned By:</span>
              <UserDisplay userId={task.createdBy} />
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Created:</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          className="w-full btn-primary flex items-center justify-center gap-2 group-hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/teammembertasksubmission/${projectId}/${task.id}`)}
        >
          <span>Submit Task</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Filter Select Component
const FilterSelect = ({ value, onChange, options, icon }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-8 py-3 font-body text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 transition-all duration-200"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark">
      {icon}
    </div>
  </div>
);

// Sort Select Component
const SortSelect = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => (
  <div className="flex items-center gap-2 relative">
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="appearance-none bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-8 py-3 font-body text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
      >
        <option value="createdAt">Created Date</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
        <option value="status">Status</option>
      </select>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark">
        <SortDesc className="w-4 h-4" />
      </div>
    </div>
    <motion.button
      className="p-3 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
    >
      <SortDesc className={`w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark transition-transform duration-200 ${sortOrder === "asc" ? "rotate-180" : ""}`} />
    </motion.button>
  </div>
);

// Pagination Component
const PaginationComponent = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div 
      className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          Showing {startItem} to {endItem} of {totalItems} tasks
        </p>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="px-4 py-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl font-body text-txt-primary-light dark:text-txt-primary-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: currentPage === 1 ? 1 : 1.02 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.98 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </motion.button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              
              return (
                <motion.button
                  key={page}
                  className={`w-10 h-10 rounded-xl font-body text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-brand-primary-500 text-white shadow-lg" 
                      : "bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </motion.button>
              );
            })}
          </div>
          
          <motion.button
            className="px-4 py-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl font-body text-txt-primary-light dark:text-txt-primary-dark disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.02 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.98 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function MyTasksPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const memberId = getMemberIdFromToken();

  // 🔹 Fetch tasks using Apollo Client
  const { data, loading, error, refetch } = useQuery(GET_TASKS_FOR_MEMBER, {
    variables: { memberId, projectId },
    skip: !memberId || !projectId,
    pollInterval: 30000, // Refresh every 30 seconds
  });

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const tasksPerPage = 6;

  const tasks = data?.getTasksForMember || [];

  // Enhanced filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Enhanced sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
      case "dueDate":
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default: // createdAt
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, sortBy]);

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-brand-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-center mt-4 font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Loading your tasks...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <motion.div 
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Tasks
            </h3>
            <p className="font-body text-red-600 dark:text-red-300 mb-4">
              {error.message}
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => refetch()}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
          layout
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                My Tasks
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                Manage and track your assigned tasks
              </p>
            </div>
            <motion.div 
              className="flex items-center gap-4 text-txt-secondary-light dark:text-txt-secondary-dark"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-brand-primary-500">
                  {tasks.length}
                </div>
                <div className="text-sm">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-green-500">
                  {tasks.filter(t => t.status === "Done" || t.status === "Completed").length}
                </div>
                <div className="text-sm">Completed</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
          layout
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                className="w-full pl-12 pr-12 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 font-body text-txt-primary-light dark:text-txt-primary-dark transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Filter Toggle */}
            <motion.button
              className="lg:hidden btn-secondary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "All", label: "All Status" },
                  { value: "To Do", label: "To Do" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Done", label: "Done" },
                  { value: "Pending Approval", label: "Pending Approval" },
                  { value: "Completed", label: "Completed" }
                ]}
                icon={<Flag className="w-4 h-4" />}
              />

              <FilterSelect
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={[
                  { value: "All", label: "All Priorities" },
                  { value: "High", label: "High Priority" },
                  { value: "Medium", label: "Medium Priority" },
                  { value: "Low", label: "Low Priority" }
                ]}
                icon={<Flag className="w-4 h-4" />}
              />

              <SortSelect
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FilterSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "All", label: "All Status" },
                      { value: "To Do", label: "To Do" },
                      { value: "In Progress", label: "In Progress" },
                      { value: "Done", label: "Done" },
                      { value: "Pending Approval", label: "Pending Approval" },
                      { value: "Completed", label: "Completed" }
                    ]}
                    icon={<Flag className="w-4 h-4" />}
                  />

                  <FilterSelect
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    options={[
                      { value: "All", label: "All Priorities" },
                      { value: "High", label: "High Priority" },
                      { value: "Medium", label: "Medium Priority" },
                      { value: "Low", label: "Low Priority" }
                    ]}
                    icon={<Flag className="w-4 h-4" />}
                  />

                  <SortSelect
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tasks Grid */}
        <AnimatePresence mode="wait">
          {currentTasks.length > 0 ? (
            <motion.div
              key="tasks-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {currentTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  projectId={projectId}
                  navigate={navigate}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-tasks"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-12 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                No Tasks Found
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                {searchTerm || statusFilter !== "All" || priorityFilter !== "All"
                  ? "Try adjusting your search criteria or filters"
                  : "You don't have any tasks assigned yet"}
              </p>
              {(searchTerm || statusFilter !== "All" || priorityFilter !== "All") && (
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setPriorityFilter("All");
                  }}
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedTasks.length}
            itemsPerPage={tasksPerPage}
          />
        )}
      </motion.div>
    </div>
  );
}
