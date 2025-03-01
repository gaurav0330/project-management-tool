const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const leadService = require("../../services/leadService");

const leadResolvers = {
  Query: {
    getProjectsByLeadId: async (_, args) => {
      return await leadService.getProjectsByLeadId(args.leadId);
    },
  },
 
  Mutation: {
    addTeamMember: async (_, { projectId, teamMembers }, { user }) => {
      return await leadService.assignTeamMembers(projectId, teamMembers, user);
    },

  },
};

module.exports = leadResolvers;
