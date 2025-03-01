const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");

const projectService = {
  createProject: async ({ title, description, startDate, endDate, managerId }) => {
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      projectManager: managerId,  // ✅ Correct field name
      status: "Planned"
    });
  
    await project.save();
    return project;
  },

  getAllProjects: async () => {
    return await Project.find().populate("projectManager");
  },

  getProjectById: async (id) => {
    return await Project.findById(id).populate("projectManager");
  },

  getProjectsByManagerId: async (managerId) => {
    return await Project.find({ projectManager: managerId });
  },

 


  assignTeamLead: async (projectId, teamLeadIds, userId) => {
    const project = await Project.findById(projectId)
      .populate("projectManager teamLead")
      .exec();
  
    if (!project) throw new Error("Project not found!");
  
    if (project.projectManager._id.toString() !== userId.toString()) {
      throw new Error("Unauthorized! You can only assign Team Leads to your own projects.");
    }
  
    // ✅ Ensure teamLeadIds contains only valid ObjectIds
    const validTeamLeadIds = await User.find(
      { _id: { $in: teamLeadIds } }, 
      '_id' // Fetch only _id field
    ).lean();
  
    if (validTeamLeadIds.length === 0) {
      throw new Error("Invalid team lead IDs provided.");
    }
  
    // ✅ Prevent duplicates before updating
    const existingTeamLeads = new Set(project.teamLead.map(lead => lead._id.toString()));
    validTeamLeadIds.forEach(lead => existingTeamLeads.add(lead._id.toString()));
  
    // Convert the Set back to an array of ObjectIds
    project.teamLead = Array.from(existingTeamLeads).map(id => new mongoose.Types.ObjectId(id)); // Ensure ObjectId type
    await project.save();
  
    // ✅ Populate updated team leads before returning
    await project.populate("teamLead");
  
    return {
      ...project._doc,
      id: project._id.toString(),
      projectManager: project.projectManager
        ? { ...project.projectManager._doc, id: project.projectManager._id.toString() }
        : null,
      teamLead: project.teamLead.map(lead => ({
        ...lead._doc,
        id: lead._id.toString(),
      })),
    };
  },
  
  
  
  
  
};

module.exports = projectService;