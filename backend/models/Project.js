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
  teamLeads: [TeamLeadSchema], // Stores both ID and role
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, required: true, default: "Planned" }
});

module.exports = mongoose.model("Project", ProjectSchema);
