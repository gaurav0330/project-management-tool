const { gql } = require("apollo-server-express");

const leadTypeDefs = gql`
  type Project {
    id: ID!
    title: String!
    description: String
    startDate: String!
    endDate: String!
    category: String
    status: String!
    projectManager: User!
    teamLeads: [TeamLead!]!
    teamMembers: [TeamMember!]!
  }

  type TeamLead {
    teamLeadId: ID!
    leadRole: String!
  }
  
  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String
    newStatus: String
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
    attachments: [String] # New field for attachments
    history: [TaskHistory]
  }

 
 
  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }

  type Query {
    getProjectsByLeadId(leadId: ID!): [Project]
  }

  type Mutation {

    assignTaskMember(
      projectId: ID!
      title: String!
      description: String
      assignedTo: ID!
      priority: String
      dueDate: String
    ): TaskResponse!

    # ✅ Task Management Mutations for Team Leads
    updateTaskStatus(taskId: ID!, status: String!): TaskResponse!
    addTaskAttachment(taskId: ID!, attachment: String!): TaskResponse!
    sendTaskForApproval(taskId: ID!): TaskResponse!
    requestTaskReview(taskId: ID!): TaskResponse!

    # ✅ Manager Approval Mutations (Already Added)
    approveTaskCompletion(taskId: ID!, approved: Boolean!, remarks: String): TaskResponse!
    rejectTask(taskId: ID!, reason: String!): TaskResponse!
    requestTaskModifications(taskId: ID!, feedback: String!): TaskResponse!
  }
`;

module.exports = leadTypeDefs;
