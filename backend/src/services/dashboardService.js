const Project = require("../models/Project");

const getProjectStatistics = async () => {
  const projects = await Project.find();
  return {
    total: projects.length,
    ongoing: projects.filter(p => p.status === "Ongoing").length,
    completed: projects.filter(p => p.status === "Completed").length,
    pending: projects.filter(p => p.status === "Pending").length
  };
};

module.exports = { getProjectStatistics };
