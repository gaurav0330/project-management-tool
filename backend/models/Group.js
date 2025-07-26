// filepath: c:\Users\gbcha\Documents\MERN-Projects\project-management-tool\backend\models\Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["all", "leads", "team"],
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  teamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this references the User model
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;