import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskList({ tasks, onSelectTask }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);
    onSelectTask(task);
  };

  const filteredTasks = () => {
    let filtered = tasks;

    if (filter !== "All") {
      filtered = filtered.filter((task) => task.status === filter);
    }

    return filtered.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Done">Done</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Under Review">Under Review</option>
          <option value="Rejected">Rejected</option>
          <option value="Needs Revision">Needs Revision</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <motion.ul
        className="space-y-4 overflow-y-auto max-h-[70vh] pr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredTasks().map((task) => (
          <motion.li
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center
              ${selectedTaskId === task.id ? "bg-blue-100 border-blue-500 shadow-md" : "bg-white hover:bg-gray-50 border-gray-300"}`}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full
                ${task.status === "Completed" ? "bg-green-100 text-green-700" :
                  task.status === "Needs Revision" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"}`}
            >
              {task.status}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
