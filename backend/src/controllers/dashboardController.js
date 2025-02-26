const Project = require("../models/Project");
const Notification = require("../models/Notification");

const getManagerDashboard = async (req, res) => {
  try {
    // Fetch all projects
    const projects = await Project.find().populate("teamLead");

    // Compute project statistics
    const stats = {
      total: projects.length,
      ongoing: projects.filter(p => p.status === "Ongoing").length,
      completed: projects.filter(p => p.status === "Completed").length,
      pending: projects.filter(p => p.status === "Pending").length
    };

    // Fetch pending approvals
    const approvals = await Notification.find({ type: "approval", status: "pending" });

    res.json({ projects, stats, approvals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

module.exports = { getManagerDashboard };
