const { ApolloError } = require("apollo-server-express");
const projectService = require("../../services/projectService");
const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");
const Team = require("../../models/Teams");
const { createDefaultGroupsForProject } = require("../../services/groupService");
const crypto = require("crypto");  // ✅ NEW: For generating random secret

/**
 * Helper to normalize repo input to "username/repo" format
 * @param {string} githubRepo - Raw user input, e.g., full URL or shorthand
 * @returns {string} - normalized repo name, e.g. "gaurav0330/Testing-Webhook"
 */

const ALLOWED_STATUSES = [
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
  "Delayed",
];

function normalizeRepoName(githubRepo) {
  try {
    if (typeof githubRepo !== "string") throw new Error("GitHub repo must be a string");

    if (githubRepo.startsWith("http")) {
      // Example input: https://github.com/gaurav0330/Testing-Webhook.git
      const url = new URL(githubRepo);
      let pathname = url.pathname; // e.g., "/gaurav0330/Testing-Webhook.git"
      pathname = pathname.replace(/^\//, "").replace(/\.git$/, ""); // remove leading slash and ".git" suffix
      if (!pathname.includes("/")) throw new Error("Invalid GitHub repo URL format");
      return pathname;
    } else {
      // Assume input like "gaurav0330/Testing-Webhook"
      // Also normalize by removing trailing ".git" if present
      return githubRepo.replace(/\.git$/, "");
    }
  } catch (error) {
    throw new ApolloError(`Invalid GitHub repo format: ${error.message}`, "BAD_USER_INPUT");
  }
}


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

    getLeadsByProjectId: async (_, { projectId }, { user }) => {
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
    createProject: async (_, { title, description, startDate, endDate, category, githubRepo }, { user }) => {  // ✅ UPDATED: Added optional githubRepo
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
        managerId: user.id,
        githubRepo  // ✅ NEW: Pass optional githubRepo
      });

      // Create default chat groups for the project
      await createDefaultGroupsForProject(project._id);

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

    // ✅ NEW: Resolver for createWebhookConfig mutation
    createWebhookConfig: async (_, { projectId, githubRepo }, context) => {
      // Auth check: Only Project Managers allowed
      if (!context.user || context.user.role !== "Project_Manager") {
        throw new ApolloError("Unauthorized: Only managers can set up webhooks", "FORBIDDEN");
      }

      // Validate project existence
      const project = await Project.findById(projectId);
      if (!project) {
        throw new ApolloError("Project not found", "NOT_FOUND");
      }

      // Normalize the repo value to "username/repo"
      const normalizedRepo = normalizeRepoName(githubRepo);

      // Generate a secure random secret (32 bytes hex)
      const secret = crypto.randomBytes(32).toString("hex");

      // Save the normalized repo name and secret in the project document
      project.githubRepo = normalizedRepo;
      project.githubWebhookSecret = secret;
      await project.save();

      // Construct your webhook URL from environment variable or fallback to localhost (dev)
      const webhookUrl = process.env.APP_URL
        ? `${process.env.APP_URL.replace(/\/$/, "")}/api/github/webhook`
        : "http://localhost:5000/api/github/webhook";

      return {
        url: webhookUrl,
        secret,
      };
    },

 updateProjectStatus: async (_, { projectId, status, reason, notes }, { user }) => {
      if (!user) {
        throw new ApolloError("Unauthorized", "UNAUTHORIZED");
      }

      // Allow only Project Managers to update status
      if (user.role !== "Project_Manager") {
        throw new ApolloError("Forbidden: Only Project Managers can update project status", "FORBIDDEN");
      }

      // Validate status value
      if (!ALLOWED_STATUSES.includes(status)) {
        throw new ApolloError(`Invalid status value. Allowed values: ${ALLOWED_STATUSES.join(", ")}`, "BAD_USER_INPUT");
      }

      // Find project
      const project = await Project.findById(projectId);
      if (!project) {
        throw new ApolloError("Project not found", "NOT_FOUND");
      }
      project.status = status;

      await project.save();

      return {
        success: true,
        message: "Project status updated successfully",
        project
      };
    }

  },
};

module.exports = projectResolvers;
