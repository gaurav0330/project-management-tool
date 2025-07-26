const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");
const Team = require("../../models/Teams");

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
    console.log(`🔍 Fetching leads, teams, and members for project ID: ${projectId}`);

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

    // Extract team lead IDs from project
    const teamLeadIds = project.teamLeads.map((lead) => lead.teamLeadId);
    console.log("📌 Team Lead IDs:", teamLeadIds);

    // Fetch all team lead users
    const leadUsers = await User.find({ _id: { $in: teamLeadIds } });
    console.log("👥 Retrieved Lead Users:", leadUsers);

    // Fetch all teams for this project
    const teams = await Team.find({ projectId: projectId });
    console.log("🏗️ Retrieved Teams:", teams);

    // Get all member IDs from all teams
    const allMemberIds = teams.flatMap(team => 
      team.members.map(member => member.teamMemberId)
    );
    
    // Fetch all member users in one query
    const memberUsers = await User.find({ _id: { $in: allMemberIds } });
    console.log("👤 Retrieved Member Users:", memberUsers);

    // Build the hierarchical structure
    const teamLeads = await Promise.all(
      project.teamLeads.map(async (lead) => {
        const userDetails = leadUsers.find((user) => user.id === lead.teamLeadId.toString());
        
        if (!userDetails) {
          console.warn(`⚠️ Lead user with ID ${lead.teamLeadId} not found`);
          return null;
        }

        // Find teams created by this lead
        const leadTeams = teams.filter(team => 
          team.leadId.toString() === lead.teamLeadId.toString()
        );

        // Map teams with their members
        const teamsWithMembers = leadTeams.map(team => {
          // Get members for this team
          const teamMembers = team.members.map(member => {
            const memberUser = memberUsers.find(user => 
              user.id === member.teamMemberId.toString()
            );

            if (!memberUser) {
              console.warn(`⚠️ Member user with ID ${member.teamMemberId} not found`);
              return null;
            }

            return {
              user: {
                id: memberUser.id,
                username: memberUser.username,
                email: memberUser.email,
                role: memberUser.role,
              },
              memberRole: member.memberRole,
              teamMemberId: member.teamMemberId.toString(),
            };
          }).filter(Boolean); // Remove null values

          return {
            id: team.id,
            teamName: team.teamName,
            description: team.description,
            leadId: team.leadId.toString(),
            projectId: team.projectId.toString(),
            members: teamMembers,
            createdAt: team.createdAt.toISOString(),
          };
        });

        return {
          user: {
            id: userDetails.id,
            username: userDetails.username,
            email: userDetails.email,
            role: userDetails.role,
          },
          leadRole: lead.leadRole,
          teamLeadId: lead.teamLeadId.toString(),
          teams: teamsWithMembers,
        };
      })
    );

    const validTeamLeads = teamLeads.filter(Boolean);

    console.log("✅ Final Team Leads with Teams and Members:", JSON.stringify(validTeamLeads, null, 2));

    return {
      success: true,
      message: "Team structure retrieved successfully",
      teamLeads: validTeamLeads,
    };
  } catch (error) {
    console.error("❌ Error fetching team structure:", error);
    return {
      success: false,
      message: "Error fetching team structure",
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
