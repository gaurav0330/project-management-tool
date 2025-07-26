const { ApolloError } = require("apollo-server-express");
const Team = require("../../models/Teams");
const Project = require("../../models/Project");
const mongoose  = require("mongoose");
const {sendTeamMemberAddedEmail} = require("../../services/emailService");
const User = require("../../models/User");
const { createTeamGroup, updateGroupsOnUserChange } = require("../../services/groupService");

const teamResolvers = {
  Query: {
    
     getTeamsByProjectAndLead: async (_, { projectId, leadId }) => {
        try {
          const teams = await Team.find({ projectId, leadId });
          return teams;
        } catch (error) {
          throw new Error(error.message);
        }
     },
   getTeamById: async (_, { id }) => {
  const team = await Team.findById(id).populate({
    path: "members.teamMemberId",
    select: "username email",
  });
  if (!team) return null;

  return {
    id: team.id,
    projectId: team.projectId,
    leadId: team.leadId,
    teamName: team.teamName,
    description: team.description,
    createdAt: team.createdAt,
    members: team.members || [],
  };
},
 
},

  Mutation: {
    createTeam: async (_, { projectId, teamName, description }, { user }) => {
      try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");
    
        const project = await Project.findById(projectId);
        if (!project) throw new ApolloError("Project not found", "NOT_FOUND");
    
        // Check if the user is a Team Lead of this project
        const isLead = project.teamLeads.some((lead) => lead.teamLeadId.toString() === user.id);
        if (!isLead) throw new ApolloError("Only Team Leads can create a team!", "FORBIDDEN");
    
        // ✅ Create the team with name and description
        const newTeam = new Team({
          projectId,
          leadId: user.id,
          teamName,
          description,
          members: [],
        });
    
        await newTeam.save();

        // Create a chat group for this team
        await createTeamGroup(newTeam._id);
    
        // ✅ Update the project schema to include the new team
        await Project.findByIdAndUpdate(projectId, {
          $push: { teams: newTeam._id },
        });
    
        return {
          success: true,
          message: "Team created successfully",
          team: newTeam,
        };
      } catch (error) {
        console.error("❌ Error in createTeam:", error.message);
        throw new ApolloError(`Failed to create team: ${error.message}`, "INTERNAL_SERVER_ERROR");
      }
    },
    
    
    addMemberToTeam: async (_, { teamId, teamMembers }, { user }) => {
      try {
          if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
  
          const team = await Team.findById(teamId);
          if (!team) throw new ApolloError("Team not found", "BAD_REQUEST");
  
          if (team.leadId.toString() !== user.id) {
              throw new ApolloError("Only the team lead can add members!", "FORBIDDEN");
          }
  
          // Convert teamMembers to the correct format & avoid duplicates
          const newMembers = teamMembers.map(({ teamMemberId, memberRole }) => ({
              teamMemberId: teamMemberId, 
              memberRole: memberRole,
          }));
  
          team.members.push(...newMembers);
          await team.save();

          // Update chat groups for each new member
          for (const member of newMembers) {
            await updateGroupsOnUserChange({ projectId: team.projectId, teamId: team._id, userId: member.teamMemberId, action: "add" });
          }

          // ✅ Fetch user details for email notification
        const addedUsers = await User.find({ _id: { $in: teamMembers.map(m => m.teamMemberId) } });

        // ✅ Send emails to new members
        for (const member of addedUsers) {
            await sendTeamMemberAddedEmail({
                email: member.email,
                memberName: member.username,
                teamName: team.name,
                leadName: user.username,
            });
        }
  
          // Populate `teamMemberId` to ensure it is fully retrieved
          const updatedTeam = await Team.findById(teamId);
  
          return {
              success: true,
              message: "Members added successfully",
              team: updatedTeam,
          };
      } catch (error) {
          console.error("Error adding team members:", error);
          return { success: false, message: `Failed: ${error.message}`, team: null };
      }
  }
  
  

  }
};

module.exports = teamResolvers;
