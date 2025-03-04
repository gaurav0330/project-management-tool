import { useState } from "react";
import TaskList from "./TaskList";

const tasks = [
  { id: 1, title: "Task 1", description: "Complete UI design for dashboard." },
  { id: 2, title: "Task 2", description: "Implement API integration for user auth." },
  { id: 3, title: "Task 3", description: "Fix bugs in task assignment logic." },
];

export default function TaskSubmissionPage() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");

  return (
    <div className="flex h-screen p-4">
      {/* Task List Component */}
      <TaskList tasks={tasks} onSelectTask={setSelectedTask} />

      {/* Task Details & Submission */}
      <div className="w-2/3 p-4">
        {selectedTask ? (
          <div className="border p-6 rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-semibold">{selectedTask.title}</h2>
            <p className="text-gray-600 mt-2">{selectedTask.description}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Details
              </label>
              <textarea
                placeholder="Provide submission details here..."
                className="w-full p-2 border rounded-md"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
              />
            </div>

            <div className="mt-4 flex gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Submit Task
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                Mark as Done
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a task to view details.</p>
        )}
      </div>
    </div>
  );
}
