const { gql } = require("apollo-server-express");

const projectTypeDefs = gql`
  type Project {
    id: ID!
    title: String!
    description: String
    startDate: String!
    endDate: String!
    category: String
    status: String!
    projectManager: User!
    teamLeads: [TeamLead] 
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
    createdAt: String
  }

  type TeamLead {
     user: User!  
    leadRole: String
  }

  type GetLeadsResponse {
  success: Boolean!
  message: String!
  teamLeads: [TeamLead!]!
}

  type Query {
    getAllProjects: [Project]
    getProjectById(id: ID!): Project
    getProjectsByManagerId(managerId: ID!): [Project]
    getLeadsByProjectId(projectId: ID!): GetLeadsResponse!
  }

  type Mutation {
    createProject(
      title: String!
      description: String
      startDate: String!
      endDate: String!
      category: String
    ): Project!

    assignTeamLead(projectId: ID!, teamLeads: [TeamLeadInput!]!): AssignTeamLeadResponse! 

    assignTask(
      projectId: ID!
      title: String!
      description: String
      assignedTo: ID! 
      priority: String
      dueDate: String
    ): TaskResponse!

    approveTaskCompletionByManager(taskId: ID!, approved: Boolean!, remarks: String): TaskResponse!
    rejectTaskByManager(taskId: ID!, reason: String!): TaskResponse!
    requestTaskModificationsByManager(taskId: ID!, feedback: String!): TaskResponse!

     deleteProject(projectId: ID!): Boolean!  # Only Project Managers
    leaveProject(projectId: ID!): Boolean!   # For Team Leads & Team Members

    deleteTask(taskId: ID!): Boolean!
  }

  input TeamLeadInput {
    teamLeadId: ID!
    leadRole: String!
  }

  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }

  type AssignTeamLeadResponse {
    success: Boolean!
    message: String!
    project: Project
  }
`;

module.exports = projectTypeDefs;
