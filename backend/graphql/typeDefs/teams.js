const { gql } = require("apollo-server-express");

const teamTypeDefs = gql`
  type Team {
    id: ID!
    projectId: ID!
    leadId: ID!
    teamName: String!
    description: String!
    members: [TeamMember!]!
    createdAt: String!
  }

  type TeamMember {
    teamMemberId: ID!
    memberRole: String!
  }

  input TeamMemberInput {
    teamMemberId: ID!
    memberRole: String!
  }

  type CreateTeamResponse {
    success: Boolean!
    message: String!
    team: Team
  }

  type AssignMemberResponse {
    success: Boolean!
    message: String!
    team: Team
  }

  type Query {
    getTeamsByProjectAndLead(projectId: ID!, leadId: ID!): [Team!]
  }

  type Mutation {
     createTeam(projectId: ID!, teamName: String!, description: String!): CreateTeamResponse!

     addMemberToTeam(teamId: ID!, teamMembers: [TeamMemberInput!]!): AssignMemberResponse!

  }
`;

module.exports = teamTypeDefs;
