const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }, // References Task
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User who uploaded the file
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // File storage link (Cloudinary, AWS S3, etc.)
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);