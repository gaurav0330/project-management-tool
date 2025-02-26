const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");

// 1️⃣ Get Project Manager Dashboard Data
const getProjectManagerDashboard = async (req, res) => {
  try {
    const projects = await Project.find().populate("teamLead");

    // Compute project statistics
    const stats = {
      total: projects.length,
      ongoing: projects.filter(p => p.status === "Ongoing").length,
      completed: projects.filter(p => p.status === "Completed").length,
      pending: projects.filter(p => p.status === "Pending").length
    };

    // Get pending approvals
    const approvals = await Notification.find({ type: "approval", status: "pending" });

    res.json({ projects, stats, approvals });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

// 2️⃣ Create a New Project
const createProject = async (req, res) => {
  try {
    const { name, description, deadline } = req.body;
    const newProject = new Project({ name, description, deadline });
    await newProject.save();
    res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// 3️⃣ Assign Team Lead to a Project
const assignTeamLead = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamLeadId } = req.body;

    const project = await Project.findByIdAndUpdate(projectId, { teamLead: teamLeadId }, { new: true }).populate("teamLead");

    res.json({ message: "Team Lead assigned successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error assigning Team Lead", error });
  }
};

// 4️⃣ Get Notifications & Approvals
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// 5️⃣ Approve Notifications (Task Completion, Project Changes)
const approveNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(notificationId, { status: "approved" }, { new: true });

    res.json({ message: "Approval successful", notification });
  } catch (error) {
    res.status(500).json({ message: "Error approving notification", error });
  }
};

module.exports = { 
  getProjectManagerDashboard, 
  createProject, 
  assignTeamLead, 
  getNotifications, 
  approveNotification 
};
