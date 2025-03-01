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

  assignTeamLead: async (projectId, teamLeads, userId) => {
    console.log("🔹 Received Team Lead IDs:", teamLeads);

    const project = await Project.findById(projectId).populate("projectManager teamLeads.teamLeadId");
    if (!project) throw new Error("❌ Project not found!");

    if (project.projectManager._id.toString() !== userId.toString()) {
      throw new Error("❌ Unauthorized! You can only assign Team Leads to your own projects.");
    }

    // ✅ Validate & Convert IDs
    const validTeamLeads = teamLeads
      .map(({ teamLeadId, leadRole }) => {
        console.log("🔹 Checking Team Lead ID:", teamLeadId);
        if (mongoose.isValidObjectId(teamLeadId) && leadRole) {
          return { teamLeadId: new mongoose.Types.ObjectId(teamLeadId), leadRole };
        } else {
          console.warn(`⚠️ Invalid ObjectId or missing role: ${teamLeadId}, ${leadRole}`);
          return null;
        }
      })
      .filter(entry => entry !== null); // Remove invalid entries

    if (validTeamLeads.length === 0) {
      throw new Error("❌ No valid team leads provided.");
    }

    // ✅ Merge existing and new team leads without duplicates
    const existingLeads = project.teamLeads.map(lead => lead.teamLeadId.toString());

    validTeamLeads.forEach(newLead => {
      if (!existingLeads.includes(newLead.teamLeadId.toString())) {
        project.teamLeads.push(newLead);
      }
    });

    await project.save();
    await project.populate("teamLeads.teamLeadId");

    return project;
  },
  


};

module.exports = projectService;