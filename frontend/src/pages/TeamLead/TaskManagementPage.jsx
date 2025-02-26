import React, { useState } from "react";
import TaskTable from "../../components/TeamLeadComponent/TaskTable";
import SearchBar from "../../components/TeamLeadComponent/SearchBar";
import AddTaskButton from "../../components/TeamLeadComponent/AddtaskButton";

const TaskManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, name: "Homepage Redesign", assignedTo: { name: "Sarah Wilson", avatar: "https://randomuser.me/api/portraits/women/1.jpg" }, status: "In Progress", dueDate: "Jan 20, 2025" },
    { id: 2, name: "API Integration", assignedTo: { name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }, status: "Completed", dueDate: "Jan 15, 2025" },
    { id: 3, name: "User Testing", assignedTo: { name: "Emily Brown", avatar: "https://randomuser.me/api/portraits/women/3.jpg" }, status: "To-Do", dueDate: "Jan 25, 2025" }
  ]);

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: "New Task",
      assignedTo: { name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      status: "To-Do",
      dueDate: "Feb 1, 2025"
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, name: `${task.name} (Edited)` } : task
    );
    setTasks(updatedTasks);
  };

  const handleCommentTask = (taskId) => {
    alert(`Comment on Task ID: ${taskId}`);
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Task Management</h2>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <AddTaskButton onAdd={handleAddTask} />
      </div>
      <TaskTable tasks={filteredTasks} onEdit={handleEditTask} onComment={handleCommentTask} />
    </div>
  );
};

export default TaskManagementPage;
