const { ApolloError } = require("apollo-server-express"); // ✅ Import ApolloError
const authController = require("../../controllers/authController");
const User = require("../../models/User"); // ✅ Import User model

const authResolvers = {
  Mutation: {
    signup: authController.signup,
    login: authController.login,
  },
};

const userResolvers = {
    Query: {
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
