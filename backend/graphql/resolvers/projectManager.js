const projects = [];

const projectManagerResolvers = {
  Query: {
    getProjects: () => projects,
  },
  Mutation: {
    createProject: (_, { name, description }) => {
      const newProject = { id: projects.length + 1, name, description, teamLeads: [] };
      projects.push(newProject);
      return newProject;
    },
  },
};

module.exports = projectManagerResolvers;
