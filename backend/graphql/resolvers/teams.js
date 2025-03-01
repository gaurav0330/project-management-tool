const { ApolloError } = require("apollo-server-express");
const Team = require("../../models/Teams");
const Project = require("../../models/Project");

const teamResolvers = {
  Query: {
    getTeamsByProject: async (_, { projectId }) => {
      try {
        return await Team.find({ projectId }).populate("leadId members.teamMemberId");
      } catch (error) {
        throw new ApolloError("Error fetching teams", "INTERNAL_SERVER_ERROR");
      }
    },
    getTeamByLead: async (_, { leadId }) => {
      try {
        return await Team.findOne({ leadId }).populate("leadId members.teamMemberId");
      } catch (error) {
        throw new ApolloError("Error fetching team", "INTERNAL_SERVER_ERROR");
      }
    }
  },

  Mutation: {
    createTeam: async (_, { projectId }, { user }) => {
      try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");

        const project = await Project.findById(projectId);
        if (!project) {
          throw new ApolloError("Project not found", "NOT_FOUND");
        }

        // Check if the user is a Team Lead of this project
        const isLead = project.teamLeads.some((lead) => lead.teamLeadId.toString() === user.id);
        if (!isLead) {
          throw new ApolloError("Only Team Leads can create a team!", "FORBIDDEN");
        }

        // ✅ Create the team
        const newTeam = new Team({
          projectId,
          leadId: user.id,
          members: [],
        });

        await newTeam.save();

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

        team.members.push(...teamMembers);
        await team.save();

        return { success: true, message: "Members added successfully", team };
      } catch (error) {
        return { success: false, message: `Failed: ${error.message}`, team: null };
      }
    }
  }
};

module.exports = teamResolvers;
