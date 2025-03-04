import React from "react";

const ProgressBar = ({ status, setStatus }) => {
  // Map status to corresponding progress values and colors
  const progressMap = {
    "To Do": { progress: 0, color: "bg-gray-300" },
    "In Progress": { progress: 50, color: "bg-blue-500" },
    "Done": { progress: 100, color: "bg-green-500" },
    "Pending Approval": { progress: 100, color: "bg-yellow-500" },
    "Completed": { progress: 100, color: "bg-green-500" },
  };

  const { progress, color } = progressMap[status] || { progress: 0, color: "bg-gray-300" };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Task Progress</h3>
      <div className="w-full h-4 my-2 bg-gray-200 rounded-full">
        <div
          className={`h-4 transition-all duration-300 rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 🔹 Show buttons only if status is NOT "Completed" */}
      {status !== "Completed" && (
        <div className="flex space-x-2">
          {Object.keys(progressMap)
            .filter((s) => s !== "Completed") // ❌ Hide "Completed" button
            .map((s) => (
              <button
                key={s}
                className={`px-4 py-2 rounded transition-all duration-200 ${
                  status === s
                    ? progressMap[s].color + " text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
