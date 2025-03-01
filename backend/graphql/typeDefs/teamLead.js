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
    teamLead: [User]
    teamMembers: [User!]
  }

  type Query {
    getAllProjects: [Project]
    getProjectById(id: ID!): Project
    getProjectsByLeadId(leadId: ID!): [Project]
  }

`;


module.exports = leadTypeDefs;
