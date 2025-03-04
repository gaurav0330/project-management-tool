import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { Search, X } from "lucide-react"; // ✅ Import Lucide Icons
import FilterBar from "../../components/TeamMember/FilterBar";
import Pagination from "../../components/TeamMember/Pagination";
import { motion } from "framer-motion";

// 🔹 GraphQL Query to Fetch Tasks
const GET_TASKS_FOR_MEMBER = gql`
  query GetTasksForMember($memberId: ID!, $projectId: ID!) {
    getTasksForMember(memberId: $memberId, projectId: $projectId) {
      id
      title
      description
      assignedTo
      priority
      status
      dueDate
    }
  }
`;

// 🔹 Extract memberId from JWT token
const getMemberIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return decodedToken.id;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from URL params
  const memberId = getMemberIdFromToken();

  // 🔹 Fetch tasks using Apollo Client
  const { data, loading, error } = useQuery(GET_TASKS_FOR_MEMBER, {
    variables: { memberId, projectId },
    skip: !memberId || !projectId, // Skip query if memberId or projectId is missing
  });

  console.log(memberId);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

  // 🔹 Extract tasks from query response
  const tasks = data?.getTasksForMember || [];

  // 🔹 Apply filtering and sorting
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "All" || task.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortBy === "Priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  // 🔹 Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching tasks: {error.message}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <button
          className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
         
        >
          + Add Task
        </button>
      </div>

      {/* 🔹 Search & Filter Bar */}
      <div className="relative flex items-center p-2 mt-4 bg-white rounded-md shadow-md">
        
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-10 text-gray-700 border-none outline-none focus:ring-0"
        />
        {searchTerm && (
          <X
            className="absolute text-gray-500 cursor-pointer right-3"
            size={20}
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>

      

      {/* 🔹 Task List (Including AssignedBy & DueDate) */}
       
    <div className="p-4 mt-4 bg-white rounded-lg shadow-lg">
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="p-4 mb-4 transition-all border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
            initial={{ opacity: 0, y: 10 }} // ✅ Fade & Slide-in Animation
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }} // ✅ Hover Effect
          >
            {/* 🔹 Task Title & Description */}
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>

            {/* 🔹 Priority & Status */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <span className="font-medium">🔥 Priority: {task.priority}</span>
              <span className="px-3 py-1 text-xs text-white rounded-full" style={{ backgroundColor: task.status === "Done" ? "green" : task.status === "In Progress" ? "blue" : "gray" }}>
                {task.status}
              </span>
            </div>

            {/* 🔹 Assigned By & Due Date */}
            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span>👤 Assigned by: {task.assignedBy}</span>
            </div>

            {/* 🔹 Task Submission Button */}
            <motion.button
              className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
              whileHover={{ scale: 1.05 }} // ✅ Button Hover Animation
              whileTap={{ scale: 0.95 }} // ✅ Click Animation
              onClick={() => navigate(`/teammembertasksubmission/${projectId}/${task.id}`)}
            >
              Submit Task
            </motion.button>
          </motion.div>
        ))
      ) : (
        <motion.p
          className="text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No tasks found.
        </motion.p>
      )}
    </div>
  


      {/* 🔹 Pagination */}
      <Pagination
        totalTasks={filteredTasks.length}
        tasksPerPage={tasksPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
