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
    teamMembers: [User!]!
  }

  type TeamLead {
    teamLeadId: User!  
    leadRole: String!
  }

  type Query {
    getAllProjects: [Project]
    getProjectById(id: ID!): Project
    getProjectsByManagerId(managerId: ID!): [Project]
  }

  type Mutation {
    createProject(
      title: String!
      description: String
      startDate: String!
      endDate: String!
    ): Project!

    assignTeamLead(projectId: ID!, teamLeads: [TeamLeadInput!]!): AssignTeamLeadResponse! 
  }

  input TeamLeadInput {
    teamLeadId: ID!
    leadRole: String!
  }

  type AssignTeamLeadResponse {
    success: Boolean!
    message: String!
    project: Project
  }
`;

module.exports = projectTypeDefs;
