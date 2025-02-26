export default function TaskList({ tasks, onSelectTask }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Task Approval</h2>
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full p-2 border rounded-md mb-3"
        />
        <div className="flex gap-2 mb-4">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button key={status} className="px-3 py-1 border rounded">
              {status}
            </button>
          ))}
        </div>
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-100 flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.assignedTo}</p>
                <p className="text-xs text-gray-500">Submitted: {task.submittedDate}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  task.status === "Pending"
                    ? "bg-yellow-200 text-yellow-700"
                    : task.status === "Approved"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  