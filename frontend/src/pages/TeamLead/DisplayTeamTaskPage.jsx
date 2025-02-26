import React, { useState } from "react";
import TaskColumn from "../../components/TeamLeadComponent/TaskColumn";
import AddTaskButton from "../../components/TeamLeadComponent/AddtaskButton";
import Modal from "../../components/TeamLeadComponent/Modal";

const DisplayTeamTaskPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Update Dashboard", description: "Implement new design", assignedTo: { name: "Sarah K.", avatar: "https://randomuser.me/api/portraits/women/1.jpg" }, status: "To Do", category: "Design", dueDate: "2025-03-15" },
    { id: 2, title: "API Integration", description: "Connect backend services", assignedTo: { name: "Mike R.", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }, status: "In Progress", category: "Development", dueDate: "2025-03-20" },
    { id: 3, title: "User Authentication", description: "Implement OAuth2", assignedTo: { name: "Alex M.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" }, status: "Done", category: "Security", dueDate: "Completed" },
  ]);

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Team Tasks</h2>
        <AddTaskButton onClick={() => setShowModal(true)} />
      </div>
      <div className="flex space-x-4">
        <TaskColumn title="To Do" tasks={tasks.filter(t => t.status === "To Do")} />
        <TaskColumn title="In Progress" tasks={tasks.filter(t => t.status === "In Progress")} />
        <TaskColumn title="Done" tasks={tasks.filter(t => t.status === "Done")} />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default DisplayTeamTaskPage;
