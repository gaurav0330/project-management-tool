const projectManagerResolvers = require("./projectManager");
const leadResolvers = require("./teamLead");

const authResolvers = require("./user");

const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...leadResolvers.Query
    
  
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...projectManagerResolvers.Mutation,
    ...leadResolvers.Mutation

  },
};

module.exports = resolvers;
