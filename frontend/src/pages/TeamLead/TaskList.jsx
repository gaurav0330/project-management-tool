import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskList({ tasks, onSelectTask }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);
    onSelectTask(task);
  };

  return (
    <div className="p-4 w-1/3 border-r">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Tasks</h2>
      <ul className="h-[80vh] pr-2 overflow-y-auto space-y-3">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              selectedTaskId === task.id
                ? "bg-blue-100 border-blue-500 shadow-md"
                : "bg-white hover:bg-gray-50 border-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
