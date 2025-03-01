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
     
    approveTaskCompletion: async (_, args, context) => {
      return leadService.approveTaskCompletionService(args, context.user);
    },


     // ✅ New: Reject Task Mutation
     rejectTask: async (_, { taskId, reason }, { user }) => {
      try {
        return await leadService.rejectTaskService(taskId, reason, user);
      } catch (error) {
        throw new ApolloError(error.message, "REJECT_TASK_FAILED");
      }
    },

    // ✅ New: Request Task Modifications
    requestTaskModifications: async (_, { taskId, feedback }, { user }) => {
      try {
        return await leadService.requestTaskModificationsService(taskId, feedback, user);
      } catch (error) {
        throw new ApolloError(error.message, "REQUEST_TASK_MODIFICATION_FAILED");
      }
    },
    
  },
};

module.exports = leadResolvers;
