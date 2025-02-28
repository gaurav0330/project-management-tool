const Project = require("../models/Project");

const projectService = {
    createProject: async ({ title, description, startDate, endDate, managerId }) => {
        const project = new Project({
          title,
          description,
          startDate,
          endDate,
          manager: managerId,
          status: "Planned"  // ✅ Add this to avoid missing status issue
        });
    
        await project.save();
        return project;
      },

  getAllProjects: async () => {
    return await Project.find().populate("manager");
  },

  getProjectById: async (id) => {
    return await Project.findById(id).populate("manager");
  },
};

module.exports = projectService;
