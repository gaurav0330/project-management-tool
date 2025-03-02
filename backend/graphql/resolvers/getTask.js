const Task = require("../../models/Task");
const User = require("../../models/User");
const {ApolloError} = require("apollo-server-express");
const mongoose = require("mongoose"); 
const taskService = require("../../services/taskService");

const gettaskResolvers = {
  Query: {
      getTasksByManager: async (_, { managerId, projectId }) => {
        if (!managerId) {
          throw new Error("Manager ID is required");
        }
        return await taskService.getTasksByManager(managerId, projectId);
      },
 
  },

};

module.exports = gettaskResolvers;
