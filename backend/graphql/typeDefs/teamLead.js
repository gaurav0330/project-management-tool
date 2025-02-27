const { gql } = require("apollo-server-express");

const teamLeadTypeDefs = gql`
  type TeamLead {
    id: ID!
    name: String!
    email: String!
    projects: [Project]
  }

  type Query {
    getTeamLeads: [TeamLead]
  }

  type Mutation {
    assignTeamLead(name: String!, email: String!): TeamLead
  }
`;

module.exports = teamLeadTypeDefs;
