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
      try {
        return await leadService.assignTeamMembers(projectId, teamMembers, user);
      } catch (error) {
        throw new ApolloError(error.message, "ADD_TEAM_MEMBER_FAILED");
      }
    },

    assignTaskMember: async (_, args, context) => {
      try {
        return await leadService.assignTaskMemberService({ ...args, user: context.user });
      } catch (error) {
        throw new ApolloError(error.message, "ASSIGN_TASK_MEMBER_FAILED");
      }
    },

  },
};

module.exports = leadResolvers;
