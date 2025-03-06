const Project = require("../../models/Project");
const Task = require("../../models/Task");
const Team = require("../../models/Teams");

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
    getTaskHistory: async (_, { taskId }) => {
      const task = await Task.findById(taskId);
      return task ? task.history : [];
    },

    // 5. Get Overdue and Upcoming Tasks
    getOverdueAndUpcomingTasks: async (_, { projectId }) => {
      const tasks = await Task.find({ project : projectId });
      const today = new Date();

      const overdueTasks = tasks
        .filter(task => new Date(task.dueDate) < today && task.status !== "Completed")
        .map(task => ({
          taskId: task._id,
          title: task.title,
          dueDate: task.dueDate.toISOString(),
          assignedTo: task.assignedTo
        }));

      const upcomingTasks = tasks
        .filter(task => new Date(task.dueDate) >= today && task.status !== "Completed")
        .map(task => ({
          taskId: task._id,
          title: task.title,
          dueDate: task.dueDate.toISOString(),
          assignedTo: task.assignedTo
        }));

      return { overdueTasks, upcomingTasks };
    },

    // 6. Get Project Issues
    getProjectIssues: async (_, { projectId }) => {
      const tasks = await Task.find({ project : projectId });

      const projectIssues = tasks
        .filter(task => ["Needs Revision", "Rejected", "Pending Approval"].includes(task.status))
        .map(task => ({
          taskId: task._id,
          title: task.title,
          assignedTo: task.assignedTo,
          status: task.status,
          remarks: task.remarks || ""
        }));

      return projectIssues;
    }
  }
};

module.exports = resolvers;
