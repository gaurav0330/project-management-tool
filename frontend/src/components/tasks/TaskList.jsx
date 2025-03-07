import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskList({ tasks, onSelectTask }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);
    onSelectTask(task);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "Approved":
        return "bg-green-100 text-green-700 border-green-400";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Task Approval</h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer transition-all duration-300 ${
              selectedTaskId === task.id
                ? "bg-blue-50 border-blue-500 shadow-md"
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="font-semibold text-gray-900">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.assignName}</p>
              <p className="text-xs text-gray-500">Submitted: {task.submittedDate}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(task.status)}`}
            >
              {task.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
