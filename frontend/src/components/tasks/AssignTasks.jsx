import React, { useState } from "react";

const AssignTasks = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("Sarah Connor (Frontend Lead)");

  // Mock task progress data
  const taskTimeline = [
    { id: 1, name: "Task 1", progress: 80 },
    { id: 2, name: "Task 2", progress: 50 },
    { id: 3, name: "Task 3", progress: 30 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Project Sections</h2>
        <ul className="space-y-2">
          <li className="p-2 text-blue-700 bg-blue-100 rounded-md cursor-pointer">Frontend Development</li>
          <li className="p-2 rounded-md cursor-pointer hover:bg-gray-200">Backend Development</li>
          <li className="p-2 rounded-md cursor-pointer hover:bg-gray-200">UI/UX Design</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          {/* Task Creation Form */}
          <h2 className="mb-4 text-xl font-semibold">Create New Task</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 p-2 border rounded-md"
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority Level Dropdown */}
              <div>
                <label className="text-sm text-gray-700">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Due Date Input */}
              <div>
                <label className="text-sm text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Assign to Dropdown */}
            <div>
              <label className="text-sm text-gray-700">Assign to</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option>Sarah Connor (Frontend Lead)</option>
                <option>John Doe (Backend Lead)</option>
                <option>Lisa Smith (UI/UX Designer)</option>
              </select>
            </div>

            <button className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
              Create Task
            </button>
          </div>
        </div>

        {/* Task Timeline */}
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Task Timeline</h2>
          <div className="space-y-4">
            {taskTimeline.map((task) => (
              <div key={task.id}>
                <p className="text-sm font-medium">{task.name}</p>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-3 bg-blue-500 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Total Tasks Assigned</p>
            <span className="text-xl font-semibold text-blue-600">24</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Pending Approvals</p>
            <span className="text-xl font-semibold text-blue-600">8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTasks;
