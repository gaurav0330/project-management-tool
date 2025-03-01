const { gql } = require("apollo-server-express");
const projectManagerTypeDefs = require("./projectManager");
const leadTypeDefs = require("./teamLead");
const userTypeDefs = require("./user");

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = [
  userTypeDefs,
  baseTypeDefs,
  leadTypeDefs,
  projectManagerTypeDefs,
];

module.exports = typeDefs;
