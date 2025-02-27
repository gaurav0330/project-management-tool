const teamMembers = [];

const teamMemberResolvers = {
  Query: {
    getTeamMembers: () => teamMembers,
  },
  Mutation: {
    addTeamMember: (_, { name, email }) => {
      const newMember = { id: teamMembers.length + 1, name, email, tasks: [] };
      teamMembers.push(newMember);
      return newMember;
    },
  },
};

module.exports = teamMemberResolvers;
