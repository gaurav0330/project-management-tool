import { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { Search, Filter } from "lucide-react";
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
  const teamLeadId = decodedToken.id;

  const { data, loading, error } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const filteredTasks = data.getTasksByTeamLead.filter(
    (task) =>
      (filter === "All" || task.status === filter) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen p-4 bg-gray-100">
      {/* Left Panel - Task List */}
      <motion.div
        className="w-2/3 p-4 bg-white rounded-lg shadow flex flex-col"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Bar & Filter */}
        <div className="sticky top-0 bg-white z-10 pb-2 flex flex-col gap-3">
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
              className="w-full p-2 flex justify-between items-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filter} <Filter className="w-5 h-5 text-gray-500" />
            </button>

            {/* Animated Dropdown */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  className="absolute left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-10"
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
                      className="p-2 hover:bg-gray-200 cursor-pointer transition"
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
        <div className="overflow-y-auto flex-1 mt-2 pr-2" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <TaskList tasks={filteredTasks} onSelectTask={setSelectedTask} />
        </div>
      </motion.div>

      {/* Right Panel - Task Details */}
      <motion.div
        className="w-1/3 p-4 bg-white rounded-lg shadow ml-4 overflow-y-auto"
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
