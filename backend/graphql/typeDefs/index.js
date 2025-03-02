const { gql } = require("apollo-server-express");
const projectManagerTypeDefs = require("./projectManager");
const leadTypeDefs = require("./teamLead");
const userTypeDefs = require("./user");
const teamTypeDefs = require("./teams");
const memberTypeDefs = require("./member");

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
  teamTypeDefs,
  memberTypeDefs,
  projectManagerTypeDefs,
];

module.exports = typeDefs;
