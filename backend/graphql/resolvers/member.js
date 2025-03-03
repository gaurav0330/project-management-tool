
const memberService = require("../../services/member");
const { ApolloError } = require("apollo-server-express");
const Team = require("../../models/Teams");

const memberResolvers = {

  Query: {
     getProjectsByMember : async (_, { memberId }) => {
      try {
        console.log("Received memberId:", memberId);
    
        if (!memberId) {
          throw new Error("memberId is required");
        }
    
        const projects = memberService.getProjectsByMember(memberId); // Call service function
    
        return projects;
      } catch (error) {
        console.error("Error in resolver:", error);
        throw new Error("Failed to fetch projects");
      }
    },
    getTeamMembers: async (_, { projectId, teamLeadId }) => {
      try {
        const team = await Team.findOne({ projectId, leadId: teamLeadId }).populate("members.teamMemberId");
        
        if (!team) {
          throw new Error("Team not found");
        }

        return team;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  Mutation: {
    updateTaskStatus: async (_, args, context) => {
      return memberService.updateTaskStatusService(args, context.user);
    },
    addTaskAttachment: async (_, args, context) => {
      return memberService.addTaskAttachmentService(args, context.user);
    },
    sendTaskForApproval: async (_, args, context) => {
      return memberService.sendTaskForApprovalService(args, context.user);
    },
    requestTaskReview: async (_, args, context) => {
        return memberService.requestTaskReviewService(args, context.user);
      },
  
  },
};
module.exports = memberResolvers;