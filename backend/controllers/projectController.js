const projectService = require("../services/projectService");

const projectController = {
  createProject: async (title, description, startDate, endDate, user) => {
    if (!user || user.role !== "Project_Manager") {
      throw new Error("Unauthorized! Only Project Managers can create projects.");
    }

    return await projectService.createProject({
      title,
      description,
      startDate,
      endDate,
      managerId: user.id,
    });
  },

  getAllProjects: async (user) => {
    if (!user) throw new Error("Unauthorized!");

    return await projectService.getAllProjects();
  },

  getProjectById: async (id, user) => {
    if (!user) throw new Error("Unauthorized!");

    return await projectService.getProjectById(id);
  },
};

module.exports = projectController;
