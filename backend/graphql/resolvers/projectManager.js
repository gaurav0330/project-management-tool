const { ApolloError } = require("apollo-server-express");
const projectController = require("../../controllers/projectController");

const projectResolvers = {
  Query: {
    getAllProjects: async (_, __, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getAllProjects(user);
    },
    getProjectById: async (_, { id }, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectController.getProjectById(id, user);
    },
  },
  Mutation: {
    createProject: async (_, { title, description, startDate, endDate }, { user }) => {
      if (!user || user.role !== "Project_Manager") {
          throw new ApolloError("Unauthorized! Only Project Managers can create projects.", "FORBIDDEN");
      }
  
      const project = await projectController.createProject(title, description, startDate, endDate, user);
      return {
          ...project._doc,
          id: project._id.toString(), // Convert ObjectId to string
          projectManager: {
              ...project.projectManager._doc,
              id: project.projectManager._id.toString() // Convert ObjectId to string
          }
      };
  },
  
    
  assignTeamLead: async (_, { projectId, teamLeadId }, { user }) => {
    console.log("User in assignTeamLead resolver:", user);
    
    if (!user || user.role !== "Project_Manager") {
      throw new ApolloError("Unauthorized! Only Project Managers can assign Team Leads.", "FORBIDDEN");
    }
  
    const project = await projectController.assignLeadController(projectId, teamLeadId, user);
  
    return {
      ...project,
      id: project.id.toString(),
    };
  },
  
  
  
  

  },
};

module.exports = projectResolvers;
