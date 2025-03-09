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

      getAllManagers: async () => {
        try{
          const managerUsers = await User.find({ role: "Project_Manager" });

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
     
          const leadUsers = await User.find({ role: "Team_Lead" });
  

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
     
          const teamMembers = await User.find({ role: "Team_Member" });
  

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
