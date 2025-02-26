import { useState } from "react";
import FilterBar from "../../components/TeamMember/FilterBar";
import TaskList from "../../components/TeamMember/TaskList";
import Pagination from "../../components/TeamMember/Pagination";
import { useNavigate } from "react-router-dom";

const initialTasks = [
  {
    id: 1,
    title: "Website Redesign Homepage",
    priority: "High Priority",
    status: "In Progress",
    dueDate: "Jan 15, 2025",
    completed: false,
  },
  {
    id: 2,
    title: "User Research Analysis",
    priority: "Medium Priority",
    status: "To Do",
    dueDate: "Jan 18, 2025",
    completed: false,
  },
  {
    id: 3,
    title: "Content Strategy Document",
    priority: "Low Priority",
    status: "Done",
    dueDate: "Jan 10, 2025",
    completed: true,
  },
  // Add more tasks if needed
];

export default function MyTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3;

const navigate = useNavigate();

  // Filtered & Sorted Tasks
  const filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "All" || task.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortBy === "Priority") {
        const priorityOrder = { "High Priority": 1, "Medium Priority": 2, "Low Priority": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded"  onClick={()=>{
navigate('/teammembertasksubmission')

        }}>+ Add Task</button>
      </div>
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setSortBy={setSortBy}
      />
      <TaskList tasks={currentTasks} setTasks={setTasks} />
      <Pagination
        totalTasks={filteredTasks.length}
        tasksPerPage={tasksPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
