const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }, // References Task
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);