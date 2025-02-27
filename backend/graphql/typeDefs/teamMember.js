const { gql } = require("apollo-server-express");

const teamMemberTypeDefs = gql`
  type TeamMember {
    id: ID!
    name: String!
    email: String!
    tasks: [String]
  }

  type Query {
    getTeamMembers: [TeamMember]
  }

  type Mutation {
    addTeamMember(name: String!, email: String!): TeamMember
  }
`;

module.exports = teamMemberTypeDefs;
