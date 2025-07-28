// memberTypeDefs.js
const { gql } = require("apollo-server-express");

const memberTypeDefs = gql`
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

  type TeamMember {
    teamMemberId: ID!
    memberRole: String!
    user: User!
  }

  # --- TEAM/PROJECT TYPES ---
  type TeamLead {
    teamLeadId: ID!
    leadRole: String!
  }

  type Team {
    id: ID!
    projectId: ID!
    leadId: ID!
    members: [TeamMember]!
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

  # --- ATTACHMENTS ---
  type Attachment {
    name: String
    size: Int
    type: String
    # url: String  # Uncomment if file URL is desired
  }

  input AttachmentInput {
    name: String
    size: Int
    type: String
    # url: String
  }

  # --- TASK AND HISTORY ---
  type TaskHistory {
    updatedBy: ID!
    updatedAt: String!
    oldStatus: String!
    newStatus: String!
  }

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
    attachments: [Attachment]
    history: [TaskHistory]
    createdAt: String
    updatedAt: String
    taskId: String  # ✅ NEW: For GitHub referencing
    closedBy: String  # ✅ NEW: Who closed it via GitHub
  }

  type TaskResponse {
    success: Boolean!
    message: String!
    task: Task
  }

  type GetMembersResponse {
    success: Boolean!
    message: String!
    members: [User]!
  }

  # --- QUERIES ---
  type Query {
    getProjectsByMember(memberId: ID!): [Project]
    getTeamMembers(teamLeadId: ID!, projectId: ID!): [TeamMember]
    getMembersByProjectId(projectId: ID!): GetMembersResponse!
    # Add more queries as needed...
  }

  # --- MUTATIONS ---
  type Mutation {
    updateTaskStatus(taskId: ID!, status: String!): TaskResponse!
    addTaskAttachment(taskId: ID!, attachment: AttachmentInput!): TaskResponse!
    sendTaskForApproval(taskId: ID!): TaskResponse!
    requestTaskReview(taskId: ID!): TaskResponse!
    closeTask(taskId: String!, closedBy: String!): Task  # ✅ NEW: Mutation to close a task
    # Add more mutations as needed...
  }
`;

module.exports = memberTypeDefs;
