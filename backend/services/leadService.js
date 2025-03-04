
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");

const leadService = {

getProjectsByLeadId: async (leadId) => {
  return await Project.find({ "teamLeads.teamLeadId": leadId });
},
 
 assignTeamMembers : async (projectId, teamMembers, user) => {
  try {
      console.log("Received projectId:", projectId);
      console.log("Received teamMembers:", teamMembers);

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

      // Ensure the user is an assigned Team Lead for this project
      const isTeamLead = project.teamLeads.some(
          (lead) => lead.teamLeadId.toString() === user.id
      );

      if (!isTeamLead) {
          return {
              success: false,
              message: "Access Denied: Only assigned Team Leads can add team members.",
          };
      }

      // Validate and format team members
      const formattedTeamMembers = teamMembers.map(({ teamMemberId, memberRole }) => {
          if (!mongoose.Types.ObjectId.isValid(teamMemberId)) {
              console.error(`❌ Invalid teamMemberId: ${teamMemberId}`);
              throw new Error(`Invalid teamMemberId: ${teamMemberId}`);
          }
          return {
              teamMemberId: new mongoose.Types.ObjectId(teamMemberId),
              memberRole,
          };
      });

      console.log("✅ Formatted team members:", formattedTeamMembers);

      // Add team members to the project
      project.teamMembers.push(...formattedTeamMembers);
      await project.save();

      // Populate response with user details
      const updatedProject = await Project.findById(projectId)
          .populate("teamMembers.teamMemberId");

      console.log("✅ Successfully updated project:", updatedProject);

      return {
          success: true,
          message: "Team members assigned successfully",
          project: updatedProject,
      };

  } catch (error) {
      console.error("❌ Error assigning team members:", error.message);
      return {
          success: false,
          message: `Failed to assign team members: ${error.message}`,
          project: null,
      };
  }
},

assignTaskMemberService: async ({ projectId, title, description, assignedTo, priority, dueDate, user }) => {
    try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new ApolloError("Invalid project ID", "BAD_REQUEST");
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            throw new ApolloError("Invalid assignedTo ID", "BAD_REQUEST");
        }

        // ✅ Optimized query using aggregation
        const project = await Project.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
            { 
                $lookup: {
                    from: "teams",
                    localField: "teams",
                    foreignField: "_id",
                    as: "teams"
                }
            },
            { 
                $unwind: "$teams"
            },
            { 
                $lookup: {
                    from: "users",
                    localField: "teams.members.teamMemberId",
                    foreignField: "_id",
                    as: "teamMembers"
                }
            },
            { 
                $match: { "teamMembers._id": new mongoose.Types.ObjectId(assignedTo) }
            },
            {
                $project: {
                    _id: 1 // Only return project ID (or more if needed)
                }
            }
        ]);

        if (project.length === 0) {
            return { success: false, message: "Assigned user is not a Team Member of this project.", task: null };
        }

        // ✅ Create the task
        const newTask = new Task({
            title,
            description,
            project: projectId,
            createdBy: user.id,
            assignedTo: new mongoose.Types.ObjectId(assignedTo),
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

approveTaskCompletionService: async ({ taskId, approved, remarks }, user) => {
    try {
        if (!user) throw new ApolloError("Unauthorized! Please log in.", "UNAUTHORIZED");

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new ApolloError("Invalid task ID", "BAD_REQUEST");
        }

        const task = await Task.findById(taskId).populate("project");
        if (!task) return { success: false, message: "Task not found", task: null };

        const project = await Project.findById(task.project).populate("teams");
        if (!project) return { success: false, message: "Project not found", task: null };

        const isTeamLead = project.teams.some(team => team.leadId.toString() === user.id);
        if (!isTeamLead) {
            throw new ApolloError("Only a Team Lead can approve tasks.", "FORBIDDEN");
        }

        task.status = approved ? "Completed" : "In Progress";
        task.remarks = remarks || "";  

        task.history.push({
            updatedBy: user.id,
            updatedAt: new Date(),
            oldStatus: task.status,
            newStatus: approved ? "Completed" : "In Progress",
        });

        await task.save();

        return {
            success: true,
            message: approved ? "Task approved successfully!" : "Task rejected, sent back to In Progress.",
            task,
        };
    } catch (error) {
        console.error("❌ Error in approveTaskCompletionService:", error.message);
        return {
            success: false,
            message: `Failed to approve task: ${error.message}`,
            task: null,
        };
    }
},


rejectTaskService: async (taskId, reason, user) => {
    try {
        if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

        const task = await Task.findById(taskId);
        if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

        task.status = "Rejected";
        task.remarks = reason; // ✅ Ensure this field is updated
        await task.save(); // ✅ Save changes

        return { success: true, message: "Task rejected successfully!", task };
    } catch (error) {
        return { success: false, message: `Failed to reject task: ${error.message}`, task: null };
    }
},


  // ✅ Request Task Modifications
  requestTaskModificationsService: async (taskId, feedback, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      const task = await Task.findById(taskId);
      if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

      task.status = "Needs Revision";
      task.remarks = feedback;
      await task.save();

      return { success: true, message: "Requested task modifications!", task };
    } catch (error) {
      return { success: false, message: `Failed to request modifications: ${error.message}`, task: null };
    }
  },
  
  updateTaskStatus: async (taskId, status, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      const task = await Task.findById(taskId);
      if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

      // Store status change history
      task.history.push({
        updatedBy: user.id,
        updatedAt: new Date().toISOString(),
        oldStatus: task.status,
        newStatus: status
      });

      task.status = status;
      await task.save();

      return { success: true, message: "Task status updated!", task };
    } catch (error) {
      return { success: false, message: `Failed to update task: ${error.message}`, task: null };
    }
  },

  // ✅ 2. Add Task Attachment
  addTaskAttachment: async (taskId, attachment, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      const task = await Task.findById(taskId);
      if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

      task.attachments.push(attachment);
      await task.save();

      return { success: true, message: "Attachment added!", task };
    } catch (error) {
      return { success: false, message: `Failed to add attachment: ${error.message}`, task: null };
    }
  },

  // ✅ 3. Send Task for Approval
  sendTaskForApproval: async (taskId, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      const task = await Task.findById(taskId);
      if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

      task.status = "Pending Approval";
      await task.save();

      return { success: true, message: "Task sent for approval!", task };
    } catch (error) {
      return { success: false, message: `Failed to send for approval: ${error.message}`, task: null };
    }
  },

  // ✅ 4. Request Task Review
  requestTaskReview: async (taskId, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      const task = await Task.findById(taskId);
      if (!task) throw new ApolloError("Task not found", "NOT_FOUND");

      task.status = "Needs Review";
      await task.save();

      return { success: true, message: "Task review requested!", task };
    } catch (error) {
      return { success: false, message: `Failed to request review: ${error.message}`, task: null };
    }
  },
  
};

module.exports = leadService;