// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const projects = [
  { id: 1, name: "Project 1", status: "In Progress" },
  { id: 2, name: "Project 2", status: "Completed" },
];

const tasks = [
  { id: 1, title: "Task 1", status: "To Do" },
  { id: 2, title: "Task 2", status: "In Progress" },
];

// Routes
app.get("/projects", (req, res) => res.json(projects));
app.get("/tasks", (req, res) => res.json(tasks));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
