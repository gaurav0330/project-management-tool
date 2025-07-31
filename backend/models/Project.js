const mongoose = require("mongoose");

const TeamLeadSchema = new mongoose.Schema({
  teamLeadId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leadRole: { type: String, required: true }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String },
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  teamLeads: [TeamLeadSchema], // Storing both ID and role
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // References to Team documents
  
  status: { 
    type: String, 
    enum: [
      "In Progress",
      "On Hold",
      "Completed",
      "Cancelled",
      "Delayed"
    ],
    required: true,
    default: "In Progress"
  },

  githubRepo: { type: String },  // Optional GitHub repo name (e.g., "username/repo-name")
  githubWebhookSecret: { type: String }  // Optional unique secret for webhook
});

module.exports = mongoose.model("Project", ProjectSchema);
