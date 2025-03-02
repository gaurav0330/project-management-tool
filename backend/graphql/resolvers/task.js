const Task = require("../../models/Task");
const User = require("../../models/User");

const taskResolvers = {
  Query: {
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
    },
};

module.exports = taskResolvers;
