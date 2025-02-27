const { gql } = require("apollo-server-express");

const projectManagerTypeDefs = gql`
  type Project {
    id: ID!
    name: String!
    description: String
    teamLeads: [TeamLead]
  }

  type Query {
    getProjects: [Project]
  }

  type Mutation {
    createProject(name: String!, description: String): Project
  }
`;

module.exports = projectManagerTypeDefs;
