const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");
const { AuthenticationError } = require("apollo-server-express");
const Team = require("../models/Teams");
const { sendTeamLeadAssignmentEmail ,sendTaskAssignedEmail,sendTaskApprovalEmail,sendTaskRejectionEmail,sendTaskModificationEmail,sendEmail} = require("../services/emailService");

const projectService = {
  createProject: async ({ title, description, startDate, endDate, managerId,category }) => {
    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      category,
      projectManager: managerId,  // ✅ Correct field name
      status: "In Progress"
    });
  
    await project.save();
    return project;
  },

  getAllProjects: async () => {
    return await Project.find().populate("projectManager");
  },

  getProjectById: async (id) => {
    const projects =  await Project.findById(id).populate("projectManager");
    return projects;
  },

  getProjectsByManagerId: async (managerId) => {
    const projects = await Project.find({ projectManager: managerId });
  
    // Format the projects to convert date strings to Date objects or formatted strings
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: new Date(project.startDate).toISOString(), // Convert to ISO string or format as needed
      endDate: new Date(project.endDate).toISOString(),     // Convert to ISO string or format as needed
      category: project.category,
      status: project.status
    }));
  },

  assignTeamLeads : async (projectId, teamLeads, user) => {
    try {


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


        project.teamLeads.push(...formattedTeamLeads);
        await project.save();

        const updatedProject = await Project.findById(projectId).populate("teamLeads.teamLeadId");


      
         // **Send Email to Assigned Team Leads**
         for (const lead of updatedProject.teamLeads) {
          const leadUser = await User.findById(lead.teamLeadId);
          if (leadUser) {
              await sendTeamLeadAssignmentEmail(leadUser.username, leadUser.email, project.title);
          }
      }

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

// Fetch Team Lead Details (assignedTo)
const teamLead = await User.findById(assignedTo);
if (!teamLead) {
    return { success: false, message: "Assigned Team Lead not found.", task: newTask };
}

// Send email notification
await sendTaskAssignedEmail({
    email: teamLead.email,
    teamLeadName: teamLead.username,
    projectManager: user.username,
    projectName: project.title,
    taskTitle: title,
    priority: priority || "Medium",
    dueDate: dueDate ? new Date(dueDate).toDateString() : "No due date",
});

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
  

 approveTaskCompletion : async (taskId, approved, remarks, user) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");
  
    // Check if the user is the project manager of the task's project
    const project = await Project.findById(task.project);
    if (!project || project.projectManager.toString() !== user.id) {
      throw new Error("Unauthorized! Only the Project Manager can approve tasks.");
    }
  
    if (!approved) {
      return {
        success: false,
        message: "Task approval denied. Please provide modifications or rejection.",
        task,
      };
    }
  
    task.status = approved ? "Completed" : "In Progress";
    task.remarks = remarks || "";
    task.history.push({
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
      oldStatus: task.status,
      newStatus: "Approved",
    });
  
    await task.save();
  
     // Fetch Team Member Details
     const teamMember = await User.findById(task.assignedTo);
     if (!teamMember) {
         return {
             success: true,
             message: "Task approved, but team member not found for email notification.",
             task,
         };
     }
 
     // Send Email Notification
     await sendTaskApprovalEmail({
         email: teamMember.email,
         teamMemberName: teamMember.username,
         projectManager: user.username,
         projectName: project.title,
         taskTitle: task.title,
         status: approved ? "Approved ✅" : "Rejected ❌",
         remarks: remarks || "No additional remarks",
     });


    return {
      success: true,
      message: "Task approved successfully!",
      task,
    };
  },
  
   rejectTask : async (taskId, reason, user) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");
  
    const project = await Project.findById(task.project);
    if (!project || project.projectManager.toString() !== user.id) {
      throw new Error("Unauthorized! Only the Project Manager can reject tasks.");
    }
  
    task.status = "Rejected";
    task.remarks = reason || "";
    task.history.push({
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
      oldStatus: task.status,
      newStatus: "Rejected",
    });
  
    await task.save();
  
  // Fetch Team Member Details
  const teamMember = await User.findById(task.assignedTo);
  if (!teamMember) {
      return {
          success: true,
          message: "Task rejected, but team member not found for email notification.",
          task,
      };
  }

  // Send Email Notification
  await sendTaskRejectionEmail({
      email: teamMember.email,
      teamMemberName: teamMember.username,
      projectManager: user.username,
      projectName: project.title,
      taskTitle: task.title,
      reason: reason || "No reason provided",
  });
    
    return {
      success: true,
      message: `Task rejected: ${reason}`,
      task,
    };
  },
  
  requestTaskModifications : async (taskId, feedback, user) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error("Task not found");
  
    const project = await Project.findById(task.project);
    if (!project || project.projectManager.toString() !== user.id) {
      throw new Error("Unauthorized! Only the Project Manager can request modifications.");
    }
  
    task.status = "Needs Revision";
    task.remarks = feedback || "";
    task.history.push({
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
      oldStatus: task.status,
      newStatus: "Needs Revision",
    });
  
    await task.save();

    // Fetch Team Member Details
    const teamMember = await User.findById(task.assignedTo);
    if (!teamMember) {
        return {
            success: true,
            message: "Modification requested, but team member not found for email notification.",
            task,
        };
    }

    // Send Email Notification
    await sendTaskModificationEmail({
        email: teamMember.email,
        teamMemberName: teamMember.username,
        projectManager: user.username,
        projectName: project.title,
        taskTitle: task.title,
        feedback: feedback || "No additional feedback provided",
    });

  
    return {
      success: true,
      message: `Task requires modifications: ${feedback}`,
      task,
    };
  },

  async deleteProject(user, projectId) {
    if (!user) throw new AuthenticationError("Not authenticated");

    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    // 🚀 **Check if the user is the Project Manager**
    if (project.projectManager.toString() !== user.id) {
      throw new Error("Only the Project Manager can delete this project");
    }

    // Delete all related teams & tasks
    await Team.deleteMany({ projectId });
    await Task.deleteMany({ project: projectId });

    // Finally, delete the project
    await Project.findByIdAndDelete(projectId);

     // ✅ **Send Email Notification**
     const subject = `Project Deleted - ${project.name}`;
     const message = `
       Hello,\n\n
       The project **"${project.name}"** has been permanently deleted by you.\n\n
       If you did not initiate this action, please contact support immediately.\n\n
       Best,\n
       Project Management Team
     `;
     
     await sendEmail(user.email, subject, message);

    return true; // Success
  },

  async leaveProject(user, projectId) {
    if (!user) throw new AuthenticationError("Not authenticated");

    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    let modified = false;

    // 🚀 **Check if user is a Team Lead and remove them**
    const leadIndex = project.teamLeads.findIndex(
      (lead) => lead.teamLeadId.toString() === user.id
    );
    if (leadIndex !== -1) {
      project.teamLeads.splice(leadIndex, 1);
      modified = true;
    }

    // 🚀 **Check if user is a Team Member and remove them**
    const teams = await Team.find({ projectId });
    for (let team of teams) {
      const memberIndex = team.members.findIndex(
        (member) => member.teamMemberId.toString() === user.id
      );

      if (memberIndex !== -1) {
        team.members.splice(memberIndex, 1);
        modified = true;

        // If team is empty, delete the team
        if (team.members.length === 0) {
          await Team.findByIdAndDelete(team._id);
        } else {
          await team.save();
        }
      }
    }

    // Save changes if modified
    if (modified) {
      await project.save();

      const subject = `You Left the Project - ${project.name}`;
      const message = `
        Hello,\n\n
        You have successfully left the project **"${project.name}"**.\n\n
        If you did not request this action, please contact support immediately.\n\n
        Best,\n
        Project Management Team
      `;

      await sendEmail(user.email, subject, message);
      return true;
    }

    
    throw new Error("User is not part of this project");
  },
  
  deleteTaskService : async ({ taskId, user }) => {
    try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApolloError("Invalid task ID", "BAD_REQUEST");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApolloError("Task not found", "NOT_FOUND");
        }

        if (!task.createdBy || !task.assignedTo) {
            throw new ApolloError("Task data is incomplete. Cannot determine permissions.", "BAD_REQUEST");
        }

        const assignedBy = task.createdBy.toString();
        const assignedTo = task.assignedTo.toString();
        const userId = user.id;

        // 🚀 **Permission Check**
        if (assignedBy === userId || assignedTo === userId) {
            await Task.findByIdAndDelete(taskId);
            return true; // ✅ Fix: Return only Boolean
        } else {
            throw new ApolloError("You do not have permission to delete this task", "FORBIDDEN");
        }
    } catch (error) {
        console.error("❌ Error in deleteTaskService:", error.message);
        return false; // ✅ Fix: Return only Boolean
    }

  
}

};

module.exports = projectService;