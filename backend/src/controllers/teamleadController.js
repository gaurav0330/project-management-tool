const Project = require("../models/Project");
const Task = require("../models/Task");

const getTeamLeadDashboard = async (req, res) => {
  try {
    const teamLeadId = req.user.id; // Get team lead ID from authenticated user

    // Fetch assigned projects
    const projects = await Project.find({ teamLead: teamLeadId });

    // Fetch tasks and group by team members
    const tasks = await Task.find({ project: { $in: projects.map(p => p._id) } }).populate("assignedTo");

    const taskDistribution = tasks.reduce((acc, task) => {
      const memberId = task.assignedTo?._id.toString() || "Unassigned";
      if (!acc[memberId]) acc[memberId] = { name: task.assignedTo?.name || "Unassigned", count: 0 };
      acc[memberId].count++;
      return acc;
    }, {});

    res.json({ projects, taskDistribution, tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};


const getTaskList = async (req, res) => {
  try {
    const teamLeadId = req.user.id;

    // Fetch projects assigned to team lead
    const projects = await Project.find({ teamLead: teamLeadId });
    const projectIds = projects.map(p => p._id);

    // Fetch tasks in those projects
    const tasks = await Task.find({ project: { $in: projectIds } }).populate("assignedTo");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task list", error });
  }
};

module.exports = { getTeamLeadDashboard , getTaskList};
