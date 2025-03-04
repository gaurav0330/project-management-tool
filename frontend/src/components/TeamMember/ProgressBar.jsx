import React from "react";

const ProgressBar = ({ progress, status, setStatus }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold">Task Progress</h3>
      <div className="w-full h-4 my-2 bg-gray-200 rounded-full">
        <div className="h-4 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex space-x-2">
        {["To Do", "In Progress", "Pending Approval"].map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded ${status === s ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
