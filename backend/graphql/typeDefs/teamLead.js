// leadTypeDefs.js
const { gql } = require("apollo-server-express");

const leadTypeDefs = gql`

  # --- ENUMS ---
  enum UserRole {
    Project_Manager
    Team_Lead
    Team_Member
  }

  # --- USER TYPES ---
  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
  }

  # --- TEAM/PROJECT TYPES ---
  type TeamLead {
    teamLeadId: ID!
    leadRole: String!
  }

  type TeamMember {
    memberId: ID!
    role: String!
  }

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

  # --- TASK HISTORY ---
  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String
    newStatus: String
    # Optionally add the user details if needed
    # user: User
  }

  # --- ATTACHMENTS ---
  type Attachment {
    name: String
    size: Int
    type: String
    # url: String  # Uncomment if you want to store file URLs
  }

  input AttachmentInput {
    name: String
    size: Int
    type: String
    # url: String  # Uncomment if you want to accept URLs
  }

  # --- TASK TYPE ---
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
    attachments: [Attachment]
    history: [TaskHistory]
    # Add fields as needed, e.g. remarks, assignName, etc.
  }

  # --- RESPONSE TYPES ---
  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }

  # --- QUERIES ---
  type Query {
    getProjectsByLeadId(leadId: ID!): [Project]
    # Add additional queries as needed
    # For example:
    # getTasksByTeamLead(teamLeadId: ID!, memberId: ID, projectId: ID): [Task]
    # getTaskById(taskId: ID!): Task
  }

  # --- MUTATIONS ---
  type Mutation {
    assignTaskMember(
      projectId: ID!
      title: String!
      description: String
      assignedTo: ID!
      priority: String
      dueDate: String
    ): TaskResponse!

    updateTaskStatus(
      taskId: ID!
      status: String!
    ): TaskResponse!

    addTaskAttachment(
      taskId: ID!
      attachment: AttachmentInput!
    ): TaskResponse!

    sendTaskForApproval(
      taskId: ID!
    ): TaskResponse!

    requestTaskReview(
      taskId: ID!
    ): TaskResponse!

    approveTaskCompletion(
      taskId: ID!
      approved: Boolean!
      remarks: String
    ): TaskResponse!

    rejectTask(
      taskId: ID!
      reason: String!
    ): TaskResponse!

    requestTaskModifications(
      taskId: ID!
      feedback: String!
    ): TaskResponse!
  }
`;

module.exports = leadTypeDefs;
