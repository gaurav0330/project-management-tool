
const memberService = require("../../services/member");

const memberResolvers = {
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