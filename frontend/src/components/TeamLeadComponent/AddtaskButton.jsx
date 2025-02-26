import React from "react";

const AddTaskButton = ({ onAdd }) => {
  return (
    <button onClick={onAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      + Add Task
    </button>
  );
};

export default AddTaskButton;
