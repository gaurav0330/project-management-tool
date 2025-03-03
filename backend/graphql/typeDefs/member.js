const { gql } = require("apollo-server-express");

const memberTypeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    project: ID!
    createdBy: ID!
    assignedTo: ID
    status: String!
    priority: String!
    dueDate: String
    attachments: [String]
    history: [TaskHistory]
    createdAt: String
    updatedAt: String
  }

  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String!
    newStatus: String!
  }

  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }


  type Project {
  id: ID!
  title: String!
  description: String
  startDate: String
  endDate: String
  category: String
  projectManager: User
  teamLeads: [TeamLead]
  teams: [Team]
  status: String
}

type TeamLead {
  teamLeadId: ID!
  leadRole: String!
}

type Team {
  id: ID!
  projectId: ID!
  leadId: ID!
  members: [TeamMember]
}

type TeamMember {
  teamMemberId: ID!
  memberRole: String!
}

type Query {
  getProjectsByMember(memberId: ID!): [Project]
  getTeamMembers(projectId: ID!, teamLeadId: ID!): Team
}


  extend type Mutation {
    updateTaskStatus(taskId: ID!, status: String!): TaskResponse!
    addTaskAttachment(taskId: ID!, attachment: String!): TaskResponse!
    sendTaskForApproval(taskId: ID!): TaskResponse!
    requestTaskReview(taskId: ID!): TaskResponse! 
  }
`;

module.exports = memberTypeDefs;
