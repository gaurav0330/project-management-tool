
const memberService = require("../../services/member");
const { ApolloError } = require("apollo-server-express");
const Team = require("../../models/Teams");
const User = require("../../models/User");


const memberResolvers = {

  Query: {
    getProjectsByMember: async (_, { memberId }) => {
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
    getTeamMembers: async (_, { teamLeadId, projectId }) => {
      try {
        // Find the team where leadId and projectId match
        const team = await Team.findOne({ leadId: teamLeadId, projectId }).populate("members.teamMemberId");

        if (!team) {
          throw new Error("Team not found");
        }

        // Format and return team members with user details
        return team.members.map(member => ({
          teamMemberId: member.teamMemberId._id,
          memberRole: member.memberRole,
          user: {
            id: member.teamMemberId._id,
            username: member.teamMemberId.username,
            email: member.teamMemberId.email,
            role: member.teamMemberId.role
          }
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    },
    
    getMembersByProjectId: async (projectId) => {
      try {
        // Find all teams associated with the given projectId
        const teams = await Team.find( projectId );
    
        console.log("Teams Found:", teams);
    
        if (!teams || teams.length === 0) {
          return {
            success: false,
            message: "No teams found for this project.",
            members: [],
          };
        }
    
        // Extract all member IDs from teams
        let memberIds = [];
        teams.forEach((team) => {
          team.members.forEach((member) => {
            memberIds.push(member.teamMemberId);
          });
        });
    
        console.log("Extracted Member IDs:", memberIds);
    
        if (memberIds.length === 0) {
          return {
            success: false,
            message: "No team members found for this project.",
            members: [],
          };
        }
    
        // Find all users matching these member IDs
        const members = await User.find({ _id: { $in: memberIds } });
    
        console.log("Fetched Members from User Collection:", members);
    
        return {
          success: true,
          message: "Team members retrieved successfully.",
          members: members.map((user) => ({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          })),
        };
      } catch (error) {
        console.error("Error fetching team members:", error);
        return {
          success: false,
          message: "An error occurred while fetching team members.",
          members: [],
        };
      }
    },
    



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