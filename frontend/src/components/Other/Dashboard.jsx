import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch data from backend when component mounts
  useEffect(() => {
    axios.get("http://localhost:5000/projects")
      .then(response => setProjects(response.data))
      .catch(error => console.error("Error fetching projects:", error));

    axios.get("http://localhost:5000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Dashboard Header */}
      <header className="bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-700">Management Dashboard</h1>
      </header>

      {/* Main Dashboard Content */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {projects.length > 0 ? (
            <ul className="list-disc ml-4 text-gray-600">
              {projects.map((project) => (
                <li key={project.id}>
                  {project.name} - <span className="font-semibold">{project.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No projects available.</p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {tasks.length > 0 ? (
            <ul className="list-disc ml-4 text-gray-600">
              {tasks.map((task) => (
                <li key={task.id}>
                  {task.title} - <span className="font-semibold">{task.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
