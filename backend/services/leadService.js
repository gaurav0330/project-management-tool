
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");

const leadService = {

getProjectsByLeadId: async (leadId) => {
  return await Project.find({ "teamLeads.teamLeadId": leadId });
},
 
 assignTeamMembers : async (projectId, teamMembers, user) => {
  try {
      console.log("Received projectId:", projectId);
      console.log("Received teamMembers:", teamMembers);

      if (!user) {
          return { success: false, message: "Unauthorized: Please log in." };
      }

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
          console.error("❌ Invalid project ID");
          throw new Error("Invalid project ID");
      }

      const project = await Project.findById(projectId);
      if (!project) {
          console.error("❌ Project not found");
          return { success: false, message: "Project not found", project: null };
      }

      // Ensure the user is an assigned Team Lead for this project
      const isTeamLead = project.teamLeads.some(
          (lead) => lead.teamLeadId.toString() === user.id
      );

      if (!isTeamLead) {
          return {
              success: false,
              message: "Access Denied: Only assigned Team Leads can add team members.",
          };
      }

      // Validate and format team members
      const formattedTeamMembers = teamMembers.map(({ teamMemberId, memberRole }) => {
          if (!mongoose.Types.ObjectId.isValid(teamMemberId)) {
              console.error(`❌ Invalid teamMemberId: ${teamMemberId}`);
              throw new Error(`Invalid teamMemberId: ${teamMemberId}`);
          }
          return {
              teamMemberId: new mongoose.Types.ObjectId(teamMemberId),
              memberRole,
          };
      });

      console.log("✅ Formatted team members:", formattedTeamMembers);

      // Add team members to the project
      project.teamMembers.push(...formattedTeamMembers);
      await project.save();

      // Populate response with user details
      const updatedProject = await Project.findById(projectId)
          .populate("teamMembers.teamMemberId");

      console.log("✅ Successfully updated project:", updatedProject);

      return {
          success: true,
          message: "Team members assigned successfully",
          project: updatedProject,
      };

  } catch (error) {
      console.error("❌ Error assigning team members:", error.message);
      return {
          success: false,
          message: `Failed to assign team members: ${error.message}`,
          project: null,
      };
  }
},
  
};

module.exports = leadService;