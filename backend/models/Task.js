const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // References Project
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the task
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User assigned to task
  status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
