const { ApolloError } = require("apollo-server-express");
const projectController = require("../../controllers/projectController");

const projectResolvers = {
  Query: {
    getAllProjects: async (_, __, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getAllProjects(user);
    },
    getProjectById: async (_, { id }, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getProjectById(id, user);
    },
  },
  Mutation: {
    createProject: async (_, { title, description, startDate, endDate }, { user }) => {
      console.log("User in resolver:", user); // Debugging

      if (!user || user.role !== "Project_Manager") {
        throw new ApolloError("Unauthorized! Only Project Managers can create projects.", "FORBIDDEN");
      }

      return await projectController.createProject(title, description, startDate, endDate, user);
    },
  },
};

module.exports = projectResolvers;
