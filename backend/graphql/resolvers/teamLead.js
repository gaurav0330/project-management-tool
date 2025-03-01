const { ApolloError } = require("apollo-server-express");
const projectController = require("../../controllers/projectController");
const projectService = require("../../services/projectService");
const leadService = require("../../services/leadService");

const leadResolvers = {
  Query: {
    getAllProjects: async (_, __, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getAllProjects(user);
    },
    getProjectById: async (_, { id }, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getProjectById(id, user);
    },
    getProjectsByLeadId: async (_, args) => {
      // console.log("Args received:", args); // Debugging
      return await leadService.getProjectsByLeadId(args.leadId);
    },
  },
};

module.exports = leadResolvers;
