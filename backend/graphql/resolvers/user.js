const { ApolloError } = require("apollo-server-express"); // ✅ Import ApolloError
const authController = require("../../controllers/authController");
const User = require("../../models/User"); // ✅ Import User model
const mongoose = require("mongoose");


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
          console.log("Fetching user with ID:", userId);
      
          // Convert userId to ObjectId
          const objectId = new mongoose.Types.ObjectId(userId);
          console.log("Converted ObjectId:", objectId);
      
          const user = await User.findById(objectId).select("-password"); // Exclude password
          console.log("User query result:", user);
          
          if (!user) {
            throw new Error("User not found");
          }
      
          console.log("User found:", user);
          return user;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("Failed to fetch user");
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
