import React, { useState } from "react";

const Modal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState(task?.category || "Design");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo.name || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">{task ? "Edit Task" : "Add Task"}</h2>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="w-full border p-2 rounded mb-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-2"></textarea>
        <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Assigned To" className="w-full border p-2 rounded mb-2" />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border p-2 rounded mb-2" />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={() => onSave({ title, description, category, assignedTo, dueDate })} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
