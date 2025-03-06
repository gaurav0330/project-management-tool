const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");

const projectResolvers = {
  Query: {
    getAllProjects: async (_, __, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectService.getAllProjects(user);
    },
    getProjectById: async (_, { id }, { user }) => {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      return await projectService.getProjectById(id, user);
    },
    getProjectsByManagerId: async (_, args) => {
      return await projectService.getProjectsByManagerId(args.managerId);
    },
    // getLeadsByProjectId: async (_, { projectId }, { user }) => {
    //   if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
  
    //   try {
          
    //       console.log(`Fetching leads for project ID: ${projectId}`); // ✅ Debugging
  
    //       // Find the project and populate the team leads
    //       const project = await Project.findById(projectId).populate("teamLeads.teamLeadId");
  
    //       if (!project) {
    //           throw new ApolloError("Project not found", "NOT_FOUND");
    //       }
  
    //       // Extract both teamLeadId (User) and leadRole
    //       const teamLeads = project.teamLeads.map(lead => ({
    //           teamLeadId: lead.teamLeadId, // ✅ This will be a User object
    //           leadRole: lead.leadRole      // ✅ This is a String
    //       }));
  
    //       console.log("✅ Leads found:", teamLeads);
    //       return teamLeads;
    //   } catch (error) {
    //       console.error("❌ Error fetching leads:", error);
    //       throw new ApolloError("Error fetching leads", "INTERNAL_SERVER_ERROR");
    //   }
    // }  


     getLeadsByProjectId : async (_, { projectId }, { user }) => {
      if (!user) {
        throw new ApolloError("Unauthorized!", "UNAUTHORIZED");
      }
    
      try {
        console.log(`🔍 Fetching leads for project ID: ${projectId}`);
    
        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
          console.error("❌ Project not found!");
          return {
            success: false,
            message: "Project not found",
            teamLeads: [],
          };
        }
    
        // Extract team lead IDs
        const teamLeadIds = project.teamLeads.map((lead) => lead.teamLeadId);
        console.log("📌 Team Lead IDs:", teamLeadIds);
    
        // Fetch all users in one query
        const users = await User.find({ _id: { $in: teamLeadIds } });
        console.log("👥 Retrieved Users:", users);
    
        // Map leads with user details
        const teamLeads = project.teamLeads
          .map((lead) => {
            const userDetails = users.find((user) => user.id === lead.teamLeadId.toString());
            
            if (!userDetails) {
              console.warn(`⚠️ User with ID ${lead.teamLeadId} not found`);
              return null; // Handle missing users gracefully
            }
    
            return {
              user: {
                id: userDetails.id,
                username: userDetails.username,
                email: userDetails.email,
                role: userDetails.role,
              },
              leadRole: lead.leadRole,
              teamLeadId: lead.teamLeadId, // Ensure teamLeadId is included
            };
          })
          .filter(Boolean); // Remove any null values
    
        console.log("✅ Final Team Leads:", teamLeads);
    
        return {
          success: true,
          message: "Team Leads retrieved successfully",
          teamLeads: teamLeads,
        };
      } catch (error) {
        console.error("❌ Error fetching leads:", error);
        return {
          success: false,
          message: "Error fetching team leads",
          teamLeads: [],
        };
      }
    }
    
  },

  Mutation: {
    createProject: async (_, { title, description, startDate, endDate , category }, { user }) => {
      if (!user || user.role !== "Project_Manager") {
        throw new ApolloError("Unauthorized! Only Project Managers can create projects.", "FORBIDDEN");
      }
  console.log(category);
      const project = await projectService.createProject({
        title,
        description,
        startDate,
        endDate,
        category: category,
        managerId: user.id
      });

      console.log(project);

      return {
        ...project._doc,
        category: category,
        id: project._id.toString(),
        projectManager: {
          ...project.projectManager._doc,
          id: project.projectManager._id.toString(),
        },
      };
    },
    
    assignTeamLead: async (_, { projectId, teamLeads }, { user }) => {
      return await projectService.assignTeamLeads(projectId, teamLeads, user);
    },

    assignTask: async (_, args, context) => {
      return await projectService.assignTaskService({ ...args, user: context.user });
    },

    approveTaskCompletionByManager: async (_, { taskId, approved, remarks }, { user }) => {
      return projectService.approveTaskCompletion(taskId, approved, remarks, user);
    },

    rejectTaskByManager: async (_, { taskId, reason }, { user }) => {
      return projectService.rejectTask(taskId, reason, user);
    },

    requestTaskModificationsByManager: async (_, { taskId, feedback }, { user }) => {
      return projectService.requestTaskModifications(taskId, feedback, user);
    },

    deleteProject: async (_, { projectId }, { user }) => {
      return await projectService.deleteProject(user, projectId);
    },

    leaveProject: async (_, { projectId }, { user }) => {
      return await projectService.leaveProject(user, projectId);
    },

    async deleteTask(_, { taskId }, { user }) {
      return await projectService.deleteTaskService({ taskId, user });
     },

  },
};

module.exports = projectResolvers;
