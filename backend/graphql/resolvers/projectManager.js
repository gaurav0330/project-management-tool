const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");

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
      
    assignTeamLead: async (_, { projectId, teamLeads }, { user }) => {
      return await projectService.assignTeamLeads(projectId, teamLeads, user);
    },

    assignTask: async (_, args, context) => {
      return await projectService.assignTaskService({ ...args, user: context.user });
  },
  
  },
};

module.exports = projectResolvers;
