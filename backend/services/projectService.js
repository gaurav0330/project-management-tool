const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");

const projectService = {
  createProject: async ({ title, description, startDate, endDate, managerId }) => {
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      projectManager: managerId,  // ✅ Correct field name
      status: "Planned"
    });
  
    await project.save();
    return project;
  },

  getAllProjects: async () => {
    return await Project.find().populate("projectManager");
  },

  getProjectById: async (id) => {
    return await Project.findById(id).populate("projectManager");
  },

  getProjectsByManagerId: async (managerId) => {
    return await Project.find({ projectManager: managerId });
  },

  assignTeamLeads : async (projectId, teamLeads, user) => {
    try {
        console.log("Received projectId:", projectId);
        console.log("Received teamLeads:", teamLeads);

        if (!user) {
            return { success: false, message: "Unauthorized: Please log in." };
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            console.error("❌ Invalid project ID");
            throw new Error("Invalid project ID");
        }

        const project = await Project.findById(projectId);
        if (!project) {
            console.error("❌ Project not found");
            return { success: false, message: "Project not found", project: null };
        }

        if (project.projectManager.toString() !== user.id) {
            return { success: false, message: "Access Denied: Only the Project Manager can assign team leads." };
        }

        const formattedTeamLeads = teamLeads.map(({ teamLeadId, leadRole }) => {
            if (!mongoose.Types.ObjectId.isValid(teamLeadId)) {
                console.error(`❌ Invalid teamLeadId: ${teamLeadId}`);
                throw new Error(`Invalid teamLeadId: ${teamLeadId}`);
            }
            return {
                teamLeadId: new mongoose.Types.ObjectId(teamLeadId),
                leadRole,
            };
        });

        console.log("✅ Formatted team leads:", formattedTeamLeads);

        project.teamLeads.push(...formattedTeamLeads);
        await project.save();

        const updatedProject = await Project.findById(projectId).populate("teamLeads.teamLeadId");

        console.log("✅ Successfully updated project:", updatedProject);

        return {
            success: true,
            message: "Team leads assigned successfully",
            project: updatedProject,
        };

    } catch (error) {
        console.error("❌ Error assigning team leads:", error.message);
        return {
            success: false,
            message: `Failed to assign team leads: ${error.message}`,
            project: null,
        };
    }
},


  assignTaskService : async ({ projectId, title, description, assignedTo, priority, dueDate, user }) => {
    try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApolloError("Invalid project ID", "BAD_REQUEST");
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new ApolloError("Invalid assignedTo ID", "BAD_REQUEST");
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return { success: false, message: "Project not found", task: null };
        }

        // if (project.projectManager.toString() !== user.id) {
        //     return { success: false, message: "Access Denied: Only the Project Manager can assign tasks." };
        // }

        const isTeamLead = project.teamLeads.some(lead => lead.teamLeadId.toString() === assignedTo);
        if (!isTeamLead) {
            return { success: false, message: "Assigned user is not a Team Lead of this project.", task: null };
        }

        // ✅ Convert assignedTo to ObjectId
        const newTask = new Task({
            title,
            description,
            project: projectId,
            createdBy: user.id,
            assignedTo: new mongoose.Types.ObjectId(assignedTo), // Ensure it's stored as ObjectId
            status: "To Do",
            priority: priority || "Medium",
            dueDate,
            createdAt: new Date(),
        });

        await newTask.save();

        return {
            success: true,
            message: "Task assigned successfully",
            task: newTask,
        };
    } catch (error) {
        console.error("❌ Error in assignTaskService:", error.message);
        return {
            success: false,
            message: `Failed to assign task: ${error.message}`,
            task: null,
        };
    }
  },
  


};

module.exports = projectService;