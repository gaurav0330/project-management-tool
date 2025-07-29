const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "To Do",
        "In Progress",
        "Completed",
        "Done",
        "Pending Approval",
        "Under Review",
        "Rejected",
        "Needs Revision",
      ],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: { type: Date },

    attachments: [
      {
        name: String,
        size: Number,
        type: String,
        url: String,
      },
    ], // File URLs

    history: [
      {
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedAt: { type: Date, default: Date.now },
        oldStatus: { type: String },
        newStatus: { type: String },
      },
    ],

    // 🔹 **GitAvilable**
    

    // 🔹 **Fix: Add remarks field**
    remarks: { type: String }, // Stores feedback, rejection reasons, etc.
    taskId: { type: String, unique: true, sparse: true },  // ✅ NEW: For GitHub referencing
    closedBy: { type: String },  // ✅ NEW: Who closed it via GitHu
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
