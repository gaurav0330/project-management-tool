export default function TaskCard({ task, setTasks }) {
    const toggleComplete = () => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    };
  
    return (
      <div className="flex justify-between items-center border-b p-3">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={task.completed} onChange={toggleComplete} />
          <p className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-white ${
            task.priority === "High Priority" ? "bg-red-500" :
            task.priority === "Medium Priority" ? "bg-yellow-500" :
            "bg-green-500"
          }`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded ${
            task.status === "Done" ? "bg-green-300 text-green-700" :
            task.status === "In Progress" ? "bg-yellow-300 text-yellow-700" :
            "bg-blue-300 text-blue-700"
          }`}>
            {task.status}
          </span>
        </div>
        <p className="text-gray-500">{task.dueDate}</p>
      </div>
    );
  }
  