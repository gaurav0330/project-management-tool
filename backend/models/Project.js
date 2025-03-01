const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String },
  projectManager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Must be ObjectId
  teamLead: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, required: true, default: "Planned" }
});

module.exports = mongoose.model("Project", ProjectSchema);
