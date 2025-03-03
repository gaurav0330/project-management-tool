
const memberService = require("../../services/member");

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