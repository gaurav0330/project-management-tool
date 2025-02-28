const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User (Project Manager)
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Planned", "In Progress", "Completed"], default: "Planned" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
