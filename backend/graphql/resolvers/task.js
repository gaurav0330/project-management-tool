const Task = require("../../models/Task");
const User = require("../../models/User");
const { ApolloError } = require("apollo-server-express");
const mongoose = require("mongoose");
const taskService = require("../../services/taskService");
const { GraphQLScalarType, Kind } = require("graphql");


const taskResolvers = {
  

  Query: {
    async getTaskById(_, { taskId }) {
    return await taskService.getTaskById(taskId);
    },
  
    async getTaskHistory(_, { taskId }) {
      try {
        const task = await Task.findById(taskId);

        if (!task) {
          throw new Error("Task not found");
        }

        return task.history.map(async (entry) => {
          const user = await User.findById(entry.updatedBy); // Fetch user manually
          return {
            updatedBy: entry.updatedBy.toString(),
            updatedAt: entry.updatedAt.toISOString(),
            oldStatus: entry.oldStatus,
            newStatus: entry.newStatus,
            user, // ✅ Manually attach user details
          };
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getTasksByManager: async (_, { managerId, projectId }) => {
      if (!managerId) {
        throw new Error("Manager ID is required");
      }
      return await taskService.getTasksByManager(managerId, projectId);
    },
    getTasksByTeamLead: async (_, { teamLeadId, memberId, projectId }) => {
      if (!teamLeadId) {
        throw new Error("Lead ID is required");
      }
      return await taskService.getTasksByTeamLead(teamLeadId, memberId, projectId);
    },

    getTasksForMember: async (_, { memberId, projectLeadId, projectId }) => {
      try {
          return await taskService.getTasksForMember(memberId, projectLeadId, projectId);
      } catch (error) {
          console.error("Error fetching tasks:", error);
          throw new Error(`Error fetching tasks: ${error.message}`);
      }
  },

  getTasksForLead: async (_, { teamLeadId, projectManagerId, projectId }) => {
    try {
        return await taskService.getTasksForMember(teamLeadId, projectManagerId, projectId);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
},

getTasksAssignedToUser: async (_, { userId }) => {
  return await taskService.getTasksAssignedToUser(userId);
},

  },

};

module.exports = taskResolvers;
