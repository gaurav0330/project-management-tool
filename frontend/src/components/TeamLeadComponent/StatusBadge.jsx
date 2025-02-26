import React from "react";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Completed": "bg-green-100 text-green-700",
    "To-Do": "bg-gray-100 text-gray-700"
  };

  return (
    <span className={`px-2 py-1 text-sm font-medium rounded ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
