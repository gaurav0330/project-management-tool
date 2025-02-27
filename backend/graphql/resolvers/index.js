const projectManagerResolvers = require("./projectManager");
const teamLeadResolvers = require("./teamLead");
const teamMemberResolvers = require("./teamMember");

const resolvers = {
  Query: {
    ...projectManagerResolvers.Query,
    ...teamLeadResolvers.Query,
    ...teamMemberResolvers.Query,
  },
  Mutation: {
    ...projectManagerResolvers.Mutation,
    ...teamLeadResolvers.Mutation,
    ...teamMemberResolvers.Mutation,
  },
};

module.exports = resolvers;
