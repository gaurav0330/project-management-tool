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
    teamLead: User!
    members: [User!]
  }

  type Message {
    id: ID!
    group: Group!
    sender: User!
    content: String!
    createdAt: String!
  }

  type Query {
    getGroups: [Group!]!
    getMessages(groupId: ID!): [Message!]!
    getGroupsByLeadId(leadId: ID!): [Group!]!
    getGroupsByMemberId(memberId: ID!): [Group!]!
  }

  type Mutation {
    createGroup(name: String!, teamLeadId: ID!, memberIds: [ID!]!): Group!
    sendMessage(groupId: ID!, senderId: ID!, content: String!): Message!
  }
`;

module.exports = chatTypeDefs;
