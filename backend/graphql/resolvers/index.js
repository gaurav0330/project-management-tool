const projectManagerResolvers = require("./projectManager");
const leadResolvers = require("./teamLead");
const userResolvers = require("./user");
const authResolvers = require("./user");
const teamResolvers = require("./teams");
const memberResolvers = require("./member");

const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...teamResolvers.Query,
    ...leadResolvers.Query,
    ...userResolvers.Query,
    ...memberResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...projectManagerResolvers.Mutation,
    ...leadResolvers.Mutation,
    ...memberResolvers.Mutation

  },
};

module.exports = resolvers;
