const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    }, // References Project

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // User who created the task

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }, // User assigned to task (Single Assignee)

    // 🔹 Allow multiple assignees (Optional Feature)
    // assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Use this for multiple assignees

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do"
    }, // Task Status

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    }, // Priority Level

    dueDate: { type: Date }, // Deadline

    attachments: [{ type: String }], // (Optional) File URLs

    history: [
      {
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who made the change
        updatedAt: { type: Date, default: Date.now }, // When the change was made
        oldStatus: { type: String }, // Previous status
        newStatus: { type: String }, // Updated status
      },
    ], // Task History for tracking updates

  },
  { timestamps: true } // 🔹 Auto-adds createdAt & updatedAt
);

module.exports = mongoose.model("Task", taskSchema);
