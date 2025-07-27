const { ApolloError } = require("apollo-server-express"); // ✅ Import ApolloError
const authController = require("../../controllers/authController");
const User = require("../../models/User"); // ✅ Import User model
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Team = require("../../models/Teams");



const authResolvers = {
  Mutation: {
    signup: authController.signup,
    login: authController.login,
  },
};

const userResolvers = {
    Query: {

      getUser: async (_, { userId }) => {
        try {
          
      
          // Convert userId to ObjectId
          const objectId = new mongoose.Types.ObjectId(userId);
          
      
          const user = await User.findById(objectId).select("-password"); // Exclude password
          
          
          if (!user) {
            throw new Error("User not found");
          }
      
          
          return user;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("Failed to fetch user");
        }
      },

      getUsersByProjectId: async (_, { projectId }) => {
        try {
          console.log("🔍 Fetching project with ID:", projectId);
  
          // Fetch the project and populate references
          const project = await Project.findById(projectId)
            .populate("projectManager")
            .populate("teamLeads.teamLeadId")
            .populate("teams");
  
          if (!project) {
            console.error("❌ Project not found!");
            throw new Error("Project not found");
          }
  
          console.log("✅ Project found:", project);
  
          // Collect all user IDs
          const projectManager = project.projectManager?._id;
          const teamLeads = project.teamLeads.map((lead) => lead.teamLeadId?._id);
          const teamIds = project.teams.map((team) => team._id);
  
          // Fetch team members from all teams
          const teams = await Team.find({ _id: { $in: teamIds } }).populate("members.teamMemberId");
          const teamMembers = teams.flatMap((team) =>
            team.members.map((member) => member.teamMemberId?._id)
          );
  
          const allUserIds = Array.from(new Set([projectManager, ...teamLeads, ...teamMembers].filter(Boolean)));
  
          console.log("✅ All User IDs:", allUserIds);
  
          // Fetch user details
          const users = await User.find({ _id: { $in: allUserIds } });
  
          return users.map((user) => ({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          }));
        } catch (error) {
          console.error("❌ Error fetching users by project ID:", error);
          throw new Error("Failed to fetch users");
        }
      },
    

      getAllManagers: async () => {
        try{
          console.log("Fetching managers..."); // Debugging
          const managerUsers = await User.find({ role: "Project_Manager" });
  
          console.log("Managers found:", managerUsers); // Debugging
          return managerUsers.map(manager => ({
            ...manager._doc,
            id: manager._id.toString(),
          }));
        }catch(error){
          console.error("Error fetching managers:", error);
          throw new ApolloError("Error fetching managers", "INTERNAL_SERVER_ERROR");
        }
      },
      // Get all users with role "Team_Lead"
      getAllLeads: async () => {
        try {
          console.log("Fetching leads..."); // Debugging
          const leadUsers = await User.find({ role: "Team_Lead" });
  
          console.log("Leads found:", leadUsers); // Debugging
          return leadUsers.map(lead => ({
            ...lead._doc,
            id: lead._id.toString(),
          }));
        } catch (error) {
          console.error("Error fetching leads:", error);
          throw new ApolloError("Error fetching leads", "INTERNAL_SERVER_ERROR");
        }
      },
  
      // Get all users with role "Team_Member"
      getAllTeamMembers: async () => {
        try {
          console.log("Fetching team members..."); // Debugging
          const teamMembers = await User.find({ role: "Team_Member" });
  
          console.log("Team Members found:", teamMembers); // Debugging
          return teamMembers.map(member => ({
            ...member._doc,
            id: member._id.toString(),
          }));
        } catch (error) {
          console.error("Error fetching team members:", error);
          throw new ApolloError("Error fetching team members", "INTERNAL_SERVER_ERROR");
        }
      },
    },
  };
   



module.exports = { ...authResolvers, ...userResolvers };
