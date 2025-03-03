const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  teamMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  memberRole: { type: String, required: true }
});

const TeamSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamName: { type: String, required: true },
  description: { type: String, required: true },
  members: [TeamMemberSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Team", TeamSchema);
