const Project = require("../../models/Project");
const Task = require("../../models/Task");
const Team = require("../../models/Teams");
const User = require("../../models/User");

const resolvers = {
  Query: {
    // 1. Get Project Progress
    getProjectProgress: async (_, { projectId }) => {
      const tasks = await Task.find({ project: projectId });
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === "Completed").length;
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      return {
        projectId,
        totalTasks,
        completedTasks,
        progressPercentage
      };
    },

    // 2. Get Team Performance
    getTeamPerformance: async (_, { projectId }) => {
      const teams = await Team.find({ projectId });
      const performances = await Promise.all(
        teams.map(async team => {
          let totalTasksAssigned = 0;
          let completedTasks = 0;

          // Iterate through each member of the team
          for (const member of team.members) {
            const tasks = await Task.find({ assignedTo: member.teamMemberId });

            totalTasksAssigned += tasks.length;
            completedTasks += tasks.filter(task => task.status === "Completed").length;
          }

          const completionRate = totalTasksAssigned > 0 ? (completedTasks / totalTasksAssigned) * 100 : 0;

          return {
            teamId: team._id,
            teamName: team.teamName,
            totalTasksAssigned,
            completedTasks,
            completionRate
          };
        })
      );
      return performances;
    },

    
    // 3. Get Task Status Breakdown
    getTaskStatusBreakdown: async (_, { projectId }) => {
      const tasks = await Task.find({ project : projectId });

      const statusBreakdown = {
        toDo: tasks.filter(task => task.status === "To Do").length,
        inProgress: tasks.filter(task => task.status === "In Progress").length,
        needsRevision: tasks.filter(task => task.status === "Needs Revision").length,
        completed: tasks.filter(task => task.status === "Completed").length
      };

      return { projectId, statusBreakdown };
    },

    // 4. Get Task History
    getTasksHistory: async (_, { projectId }) => {
      // Find all tasks associated with the projectId
      const tasks = await Task.find({ project: projectId });
      if (!tasks.length) return []; // Return empty if no tasks found

      // Fetch histories for all tasks
      const histories = await Promise.all(tasks.map(async (task) => {
        const history = task.history;

        // Fetch user details for updatedBy
        const userPromises = history.map(async (entry) => {
          const user = await User.findById(entry.updatedBy);
          return {
            updatedBy: entry.updatedBy,
            updatedAt: entry.updatedAt,
            oldStatus: entry.oldStatus,
            newStatus: entry.newStatus,
            updatedByName: user ? user.username : "Unknown",
            user: user ? { id: user.id, username: user.username, email: user.email } : null,
          };
        });

        const taskHistory = await Promise.all(userPromises);
        return {
          taskId: task._id, // Include task ID
          title: task.title,
          history: taskHistory // Group history under the task
        };
      }));

      return histories; // Return the grouped histories
    },

    // 5. Get Overdue and Upcoming Tasks
    getOverdueAndUpcomingTasks: async (_, { projectId }) => {
      const tasks = await Task.find({ project: projectId });
      const today = new Date();

      // Fetch user details for assignedTo
      const overdueTasks = await Promise.all(
        tasks
          .filter(task => new Date(task.dueDate) < today && task.status !== "Completed")
          .map(async (task) => {
            const user = await User.findById(task.assignedTo); // Fetch user details
            return {
              taskId: task._id,
              title: task.title,
              dueDate: task.dueDate.toISOString(),
              assignedTo: user ? user.username : "Unknown", // Use username instead of ID
            };
          })
      );

      const upcomingTasks = await Promise.all(
        tasks
          .filter(task => new Date(task.dueDate) >= today && task.status !== "Completed")
          .map(async (task) => {
            const user = await User.findById(task.assignedTo); // Fetch user details
            return {
              taskId: task._id,
              title: task.title,
              dueDate: task.dueDate.toISOString(),
              assignedTo: user ? user.username : "Unknown", // Use username instead of ID
            };
          })
      );

      return { overdueTasks, upcomingTasks };
    },

    // 6. Get Project Issues
    getProjectIssues: async (_, { projectId }) => {
      const tasks = await Task.find({ project: projectId });

      const projectIssues = await Promise.all(
        tasks
          .filter(task => ["Needs Revision", "Rejected", "Pending Approval"].includes(task.status))
          .map(async (task) => {
            const user = await User.findById(task.assignedTo); 
            console.log(user);
            return {
              taskId: task._id,
              title: task.title,
              assignedTo: user ? user.username : "Unknown", // Use username instead of ID
              status: task.status,
              remarks: task.remarks || ""
            };
          })
      );

      return projectIssues;
    }
  }
};

module.exports = resolvers;
