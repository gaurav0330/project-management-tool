const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  teamMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  memberRole: { type: String, required: true }
});

const TeamSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [TeamMemberSchema] // Stores members added by this lead
});

module.exports = mongoose.model("Team", TeamSchema);
