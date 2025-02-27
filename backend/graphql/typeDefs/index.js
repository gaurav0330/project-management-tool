const { gql } = require("apollo-server-express");
const projectManagerTypeDefs = require("./projectManager");
const teamLeadTypeDefs = require("./teamLead");
const teamMemberTypeDefs = require("./teamMember");

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [
  baseTypeDefs,
  projectManagerTypeDefs,
  teamLeadTypeDefs,
  teamMemberTypeDefs,
];

module.exports = typeDefs;
