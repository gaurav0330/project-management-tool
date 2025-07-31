const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const leadService = require("../../services/leadService");

const leadResolvers = {
  Query: {
    getProjectsByLeadId: async (_, args) => {
      return await leadService.getProjectsByLeadId(args.leadId);
    },

    getTeamMembersByTeamId: async (_, { teamId }) => {
      return await leadService.getTeamMembersByTeamId(teamId);
    }
  },
 
  Mutation: {
    

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

    updateTaskStatus: async (_, { taskId, status }, { user }) => {
      return await leadService.updateTaskStatus(taskId, status, user);
    },

    // ✅ 2. Add Task Attachment
    addTaskAttachment: async (_, { taskId, attachment }, { user }) => {
      return await leadService.addTaskAttachment(taskId, attachment, user);
    },

    // ✅ 3. Send Task for Approval
    sendTaskForApproval: async (_, { taskId }, { user }) => {
      return await leadService.sendTaskForApproval(taskId, user);
    },

    // ✅ 4. Request Task Review
    requestTaskReview: async (_, { taskId }, { user }) => {
      return await leadService.requestTaskReview(taskId, user);
    }
    
  },
};

module.exports = leadResolvers;
