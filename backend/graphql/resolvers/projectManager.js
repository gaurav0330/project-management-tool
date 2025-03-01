const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const mongoose = require("mongoose");
const Project = require("../../models/Project");

const projectResolvers = {
  Query: {
    getAllProjects: async (_, __, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectService.getAllProjects(user);
    },
    getProjectById: async (_, { id }, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectService.getProjectById(id, user);
    },
    getProjectsByManagerId: async (_, args) => {
      // console.log("Args received:", args); // Debugging
      return await projectService.getProjectsByManagerId(args.managerId);
    },
  },



  Mutation: {
    createProject: async (_, { title, description, startDate, endDate }, { user }) => {
      if (!user || user.role !== "Project_Manager") {
        throw new ApolloError("Unauthorized! Only Project Managers can create projects.", "FORBIDDEN");
      }
    
      // Call projectService with correct parameters
      const project = await projectService.createProject({
        title,
        description,
        startDate,
        endDate,
        managerId: user.id, 
      });
    
      return {
        ...project._doc,
        id: project._id.toString(),
        projectManager: {
          ...project.projectManager._doc,
          id: project.projectManager._id.toString(),
        },
      };
    },
    
    
    assignTeamLead : async (_, { projectId, teamLeads }, { user }) => {
      try {
          console.log("Received projectId:", projectId);
          console.log("Received teamLeads:", teamLeads);
  
          // 🔹 Ensure the user is authenticated
          if (!user) {
              return { success: false, message: "Unauthorized: Please log in." };
          }
  
          // 🔹 Validate project ID
          if (!mongoose.Types.ObjectId.isValid(projectId)) {
              console.error("❌ Invalid project ID");
              throw new Error("Invalid project ID");
          }
  
          // 🔹 Find project
          const project = await Project.findById(projectId);
          if (!project) {
              console.error("❌ Project not found");
              return { success: false, message: "Project not found", project: null };
          }
  
          // 🔹 Check if the logged-in user is the Project Manager of this project
          if (project.projectManager.toString() !== user.id) {
              return { success: false, message: "Access Denied: Only the Project Manager can assign team leads." };
          }
  
          // 🔹 Convert teamLeadId to ObjectId & Append new leads (Don't overwrite existing ones)
          const formattedTeamLeads = teamLeads.map(({ teamLeadId, leadRole }) => {
              if (!mongoose.Types.ObjectId.isValid(teamLeadId)) {
                  console.error(`❌ Invalid teamLeadId: ${teamLeadId}`);
                  throw new Error(`Invalid teamLeadId: ${teamLeadId}`);
              }
              return {
                  teamLeadId: new mongoose.Types.ObjectId(teamLeadId),
                  leadRole,
              };
          });
  
          console.log("✅ Formatted team leads:", formattedTeamLeads);
  
          // 🔹 Append new leads to existing leads (instead of overwriting)
          project.teamLeads.push(...formattedTeamLeads);
          await project.save();
  
          // 🔹 Populate updated project
          const updatedProject = await Project.findById(projectId).populate("teamLeads.teamLeadId");
  
          console.log("✅ Successfully updated project:", updatedProject);
  
          return {
              success: true,
              message: "Team leads assigned successfully",
              project: updatedProject,
          };
  
      } catch (error) {
          console.error("❌ Error assigning team leads:", error.message);
          return {
              success: false,
              message: `Failed to assign team leads: ${error.message}`,
              project: null,
          };
      }
  }
  },
};

module.exports = projectResolvers;
