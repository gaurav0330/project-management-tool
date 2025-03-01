const projectManagerResolvers = require("./projectManager");
const leadResolvers = require("./teamLead");
const userResolvers = require("./user");
const authResolvers = require("./user");
const memberResolvers = require("./user");

const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...leadResolvers.Query,
    ...userResolvers.Query,
    ...memberResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...projectManagerResolvers.Mutation,
    ...leadResolvers.Mutation

  },
};

module.exports = resolvers;
