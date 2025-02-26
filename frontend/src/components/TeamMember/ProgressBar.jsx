import React from "react";

const ProgressBar = ({ progress, status, setStatus }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Task Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-4 my-2">
        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex space-x-2">
        {["To Do", "In Progress", "Done"].map((s) => (
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
