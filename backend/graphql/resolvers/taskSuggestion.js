const { getBestUserForTask } = require('../../services/taskSuggestionService');

const taskSuggestionResolvers = {
  Query: {
    suggestBestUserForTask: async (_, { input }) => {
      const { projectId, title, userId, priority, dueDate, teamId } = input;
      try {
        const bestUser = await getBestUserForTask({
          projectId,
          title,
          userId,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          teamId,
        });
        return bestUser;
      } catch (err) {
        throw new Error(`Failed to suggest best user: ${err.message}`);
      }
    },
  },
};

module.exports = taskSuggestionResolvers;
