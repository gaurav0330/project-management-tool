const projectManagerResolvers = require("./projectManager");
const authResolvers = require("./user");

const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    
  
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...projectManagerResolvers.Mutation,

  },
};

module.exports = resolvers;
