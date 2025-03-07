const { gql } = require("apollo-server-express");

const analyticsTypeDefs = gql`
  type Query {
    getProjectProgress(projectId: ID!): ProjectProgress
    getTeamPerformance(projectId: ID!): [TeamPerformance]
    getTaskStatusBreakdown(projectId: ID!): TaskStatusBreakdown
    getTasksHistory(projectId: ID!): [TaskHistoryWithDetails]
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
    updatedByName: String
    user: User
  }

  type TaskHistoryWithDetails {
    taskId: ID!
    title: String!
    history: [TaskHistory!]!
  }

  type OverdueAndUpcomingTasks {
    overdueTasks: [TaskSummary]
    upcomingTasks: [TaskSummary]
  }

  type TaskSummary {
    taskId: ID!
    title: String!
    dueDate: String!
    assignedTo: ID!
    assignedUser: User!
  }

  type ProjectIssue {
    taskId: ID!
    title: String!
    assignedTo: ID!
    assignedUser: User!
    status: String!
    remarks: String
  }

  type User {
    id: ID!
    username: String!
    email: String
  }
`;

module.exports = analyticsTypeDefs;
