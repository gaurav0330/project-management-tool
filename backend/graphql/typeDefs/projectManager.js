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
    createdAt: String!
    projectManager: User!
    teamLead: [User]
    teamMembers: [User!]
  }

  type Query {
    getAllProjects: [Project]
    getProjectById(id: ID!): Project
  }

  type Mutation {
    createProject(title: String!, description: String, startDate: String!, endDate: String!): Project
    assignTeamLead(projectId: ID!, teamLeadId: [ID!]!): Project!
  }
`;

module.exports = projectTypeDefs;
