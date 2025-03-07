import { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "../../components/tasks/TaskList";
import TaskDetails from "../../pages/ProjectManager/TaskDetailsManager";
import  SkeletonCard  from "../../components/UI/SkeletonCard";

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
        attachments
        dueDate
        createdAt
        updatedAt
        remarks
    }
  }
`;

const FILTER_OPTIONS = [
  "All",
  "To Do",
  "In Progress",
  "Completed",
  "Done",
  "Pending Approval",
  "Under Review",
  "Rejected",
  "Needs Revision",
];

export default function TaskApprovalPage({ projectId }) {
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

  if (loading) return <SkeletonCard />;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const filteredTasks = data.getTasksByManager.filter(
    (task) =>
      (filter === "All" || task.status === filter) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen p-4 bg-gray-100">
      {/* Left Panel - Task List */}
      <motion.div
        className="flex flex-col w-2/3 p-4 bg-white rounded-lg shadow"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Bar & Filter */}
        <div className="sticky top-0 z-10 flex flex-col gap-3 pb-2 bg-white">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Dropdown Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center justify-between w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filter} <Filter className="w-5 h-5 text-gray-500" />
            </button>

            {/* Animated Dropdown */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  className="absolute left-0 z-10 w-full mt-2 bg-white border rounded-md shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {FILTER_OPTIONS.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setShowFilter(false);
                      }}
                      className="p-2 transition cursor-pointer hover:bg-gray-200"
                    >
                      {option}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 pr-2 mt-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <TaskList tasks={filteredTasks} onSelectTask={setSelectedTask} />
        </div>
      </motion.div>

      {/* Right Panel - Task Details */}
      <motion.div
        className="w-1/3 p-4 ml-4 overflow-y-auto bg-white rounded-lg shadow"
        style={{ maxHeight: "100vh" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {selectedTask ? <TaskDetails task={selectedTask} /> : <p>Select a task to view details</p>}
      </motion.div>
    </div>
  );
}
