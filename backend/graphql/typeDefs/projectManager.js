const { gql } = require("apollo-server-express");

const projectTypeDefs = gql`
  type Project {
    id: ID!
    title: String!
    description: String
    manager: User!
    startDate: String!
    endDate: String!
    status: String!
    createdAt: String!
  }

  type Query {
    getAllProjects: [Project]
    getProjectById(id: ID!): Project
  }

  type Mutation {
    createProject(title: String!, description: String, startDate: String!, endDate: String!): Project
  }
`;

module.exports = projectTypeDefs;
