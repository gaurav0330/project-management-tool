const { gql } = require("apollo-server-express");

const typeDefs = gql`
  enum UserRole {
    Project_Manager
    Team_Lead
    Team_Member
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
  }

  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String!
    newStatus: String!
    user: User
  }

  type Task {
    id: ID!
    title: String!
    description: String
    project: ID!
    createdBy: ID!
    assignedTo: ID!
    status: String!
    priority: String!
    dueDate: String
    attachments: [String]
    history: [TaskHistory]
    assignName: String
    remarks: String
  }

  type Query {
    getTaskHistory(taskId: ID!): [TaskHistory]
    getTasksByManager(managerId: ID!, projectId: ID): [Task]
    getTasksByTeamLead(teamLeadId: ID!, memberId: ID, projectId: ID): [Task]
    getTasksForMember(memberId: ID!, projectLeadId: ID, projectId: ID): [Task]
    getTasksForLead(teamLeadId: ID!, projectManagerId: ID, projectId: ID): [Task]
    getTaskById(taskId: ID!): Task
  }
`;

module.exports = typeDefs;
