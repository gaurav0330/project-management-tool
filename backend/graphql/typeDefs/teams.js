const { gql } = require("apollo-server-express");

const teamTypeDefs = gql`
  type Team {
    id: ID!
    projectId: ID!
    leadId: User!
    members: [TeamMember!]!
  }

  type TeamMember {
    teamMemberId: User!
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
    getTeamsByProject(projectId: ID!): [Team]
    getTeamByLead(leadId: ID!): Team
  }

  type Mutation {
    createTeam(projectId: ID!): CreateTeamResponse!
    addMemberToTeam(teamId: ID!, teamMembers: [TeamMemberInput!]!): AssignMemberResponse!
  }
`;

module.exports = teamTypeDefs;
