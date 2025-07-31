const { gql } = require("apollo-server-express");

const chatTypeDefs = gql`
  enum UserRole {
    Project_Manager
    Team_Lead
    Team_Member
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!  # ✅ Change from String! to UserRole!
  }

  type Group {
    id: ID!
    name: String!
    type: String!
    project: ID!
    team: ID
    teamLead: User
    members: [User!]!
    creator: User # Add creator field
  }

  type Message {
    id: ID!
    group: Group!
    sender: User!
    content: String!
    createdAt: String!
  }

  type Query {
    getGroups(projectId: ID!): [Group!]!
    getMessages(groupId: ID!): [Message!]!
    getGroupsByLeadId(leadId: ID!, projectId: ID!): [Group!]!
    getGroupsByMemberId(memberId: ID!, projectId: ID!): [Group!]!
    getGroupsByProjectId(projectId: ID!): [Group!]!
    getGroupsForLead(leadId: ID!, projectId: ID!): [Group!]!
  }

  type Mutation {
    createGroup(name: String!, teamLeadId: ID!, memberIds: [ID!]!): Group!
    createCustomGroup(
      name: String!,
      projectId: ID!,
      memberIds: [ID!]!,
      creatorId: ID # Add creatorId argument
    ): Group!
    sendMessage(groupId: ID!, senderId: ID!, content: String!): Message!
    removeMemberFromGroup(groupId: ID!, memberId: ID!): Group!
  }
`;

module.exports = chatTypeDefs;
