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
  teamLeadId: User!
  leadRole: String!
 }

  type TeamMember {
    teamMemberId: User!  
    memberRole: String!
  }

  input TeamMemberInput {
    teamMemberId: ID!
    memberRole: String!
  }

  type AssignTeamMemberResponse {
    success: Boolean!
    message: String!
    project: Project
  }

  type Query {
    getProjectsByLeadId(leadId: ID!): [Project]
  }

  type Mutation {
    addTeamMember(projectId: ID!, teamMembers: [TeamMemberInput!]!): AssignTeamMemberResponse!
  }
`;

module.exports = leadTypeDefs;
