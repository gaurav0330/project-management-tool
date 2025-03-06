const projectManagerResolvers = require("./projectManager");
const leadResolvers = require("./teamLead");
const userResolvers = require("./user");
const authResolvers = require("./user");
const teamResolvers = require("./teams");
const memberResolvers = require("./member");
const taskResolvers = require("./task");
const getTaskResolvers = require("./getTask");
const analyticsResolvers = require("./analytics");


const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...teamResolvers.Query,
    ...leadResolvers.Query,
    ...userResolvers.Query,
    ...memberResolvers.Query,
    ...taskResolvers.Query,
    ...getTaskResolvers.Query,
    ...analyticsResolvers.Query    

  },
  Mutation: {
    ...authResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...projectManagerResolvers.Mutation,
    ...leadResolvers.Mutation,
    ...memberResolvers.Mutation,
    ...taskResolvers.Mutation,


  },
};

module.exports = resolvers;
