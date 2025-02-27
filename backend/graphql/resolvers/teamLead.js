const teamLeads = [];

const teamLeadResolvers = {
  Query: {
    getTeamLeads: () => teamLeads,
  },
  Mutation: {
    assignTeamLead: (_, { name, email }) => {
      const newLead = { id: teamLeads.length + 1, name, email, projects: [] };
      teamLeads.push(newLead);
      return newLead;
    },
  },
};

module.exports = teamLeadResolvers;
