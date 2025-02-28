const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // References Project (if action is project-related)
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" }, // References Task (if action is task-related)
  action: { type: String, required: true }, // Example: "Created Task", "Updated Task"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);