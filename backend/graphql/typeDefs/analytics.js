const { gql } = require("apollo-server-express");

const analyticsTypeDefs = gql`
  type Query {
    getProjectProgress(projectId: ID!): ProjectProgress
    getTeamPerformance(projectId: ID!): [TeamPerformance]
    getTaskStatusBreakdown(projectId: ID!): TaskStatusBreakdown
    getTaskHistory(taskId: ID!): [TaskHistory]
    getOverdueAndUpcomingTasks(projectId: ID!): OverdueAndUpcomingTasks
    getProjectIssues(projectId: ID!): [ProjectIssue]
  }

  type ProjectProgress {
    projectId: ID!
    totalTasks: Int!
    completedTasks: Int!
    progressPercentage: Float!
  }

  type TeamPerformance {
    teamId: ID!
    teamName: String!
    totalTasksAssigned: Int!
    completedTasks: Int!
    completionRate: Float!
  }

  type TaskStatusBreakdown {
    projectId: ID!
    statusBreakdown: StatusCount!
  }

  type StatusCount {
    toDo: Int!
    inProgress: Int!
    needsRevision: Int!
    completed: Int!
  }

  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String!
    newStatus: String!
  }

  type OverdueAndUpcomingTasks {
    overdueTasks: [TaskSummary]
    upcomingTasks: [TaskSummary]
  }

  type TaskSummary {
    taskId: ID!
    title: String!
    dueDate: String!
    assignedTo: String!
  }

  type ProjectIssue {
    taskId: ID!
    title: String!
    assignedTo: String!
    status: String!
    remarks: String
  }
`;

module.exports = analyticsTypeDefs;
