const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");
const Project = require("../models/Project");
const User = require("../models/User");
const Team = require("../models/Teams");
const { sendTaskApprovalRequestEmail } = require("../services/emailService");

const memberService = {
  getProjectsByMember: async (memberId) => {
    try {
      console.log("Service received memberId:", memberId);

      if (!memberId) {
        throw new Error("memberId is required in service function");
      }

      const mongoose = require("mongoose");
      const memberObjectId = new mongoose.Types.ObjectId(memberId);

      const projects = await Project.aggregate([
        {
          $lookup: {
            from: "teams",
            localField: "_id",
            foreignField: "projectId",
            as: "projectTeams",
          },
        },
        {
          $match: {
            "projectTeams.members": {
              $elemMatch: { teamMemberId: memberObjectId },
            },
          },
        },
        {
          $project: {
            id: "$_id",
            title: 1,
            description: 1,
            startDate: 1,
            endDate: 1,
            category: 1,
            projectManager: 1,
            teamLeads: 1,
            teams: 1,
            status: 1,
          },
        },
      ]);

      console.log("Projects found:", projects);
      return projects;
    } catch (error) {
      console.error("Error fetching projects for member:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  // ✅ Update Task Status Service
  updateTaskStatusService: async ({ taskId, status }, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApolloError("Invalid task ID", "BAD_REQUEST");
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return { success: false, message: "Task not found", task: null };
      }

      // ✅ Check if user is the assigned team member
      if (task.assignedTo.toString() !== user.id) {
        return {
          success: false,
          message: "Only the assigned member can update this task.",
          task: null,
        };
      }

      // ✅ Allowed Status Transitions
      const validStatuses = [
        "To Do",
        "In Progress",
        "Done",
        "Completed",
        "Pending Approval",
      ];
      if (!validStatuses.includes(status)) {
        return { success: false, message: "Invalid task status", task: null };
      }

      // ✅ Save old status for history
      const oldStatus = task.status;

      // ✅ Update the status
      task.status = status;

      // ✅ Save status change to history
      task.history.push({
        updatedBy: user.id,
        updatedAt: new Date(),
        oldStatus: oldStatus,
        newStatus: status,
      });

      await task.save();

      return {
        success: true,
        message: `Task status updated to ${status}`,
        task,
      };
    } catch (error) {
      console.error("❌ Error updating task status:", error.message);
      return {
        success: false,
        message: `Failed to update task: ${error.message}`,
        task: null,
      };
    }
  },

  // ✅ Add Attachment to Task
  addTaskAttachmentService: async ({ taskId, attachment }, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApolloError("Invalid task ID", "BAD_REQUEST");
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return { success: false, message: "Task not found", task: null };
      }

      // ✅ Check if the user is assigned to the task
      if (task.assignedTo.toString() !== user.id) {
        return {
          success: false,
          message: "Only the assigned member can add attachments.",
          task: null,
        };
      }

      // ✅ Add attachment
      task.attachments.push(attachment);
      await task.save();

      return { success: true, message: "Attachment added successfully", task };
    } catch (error) {
      console.error("❌ Error adding attachment:", error.message);
      return {
        success: false,
        message: `Failed to add attachment: ${error.message}`,
        task: null,
      };
    }
  },

  // ✅ Send Task for Approval
  sendTaskForApprovalService: async ({ taskId }, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApolloError("Invalid task ID", "BAD_REQUEST");
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return { success: false, message: "Task not found", task: null };
      }

      // ✅ Check if the user is the assigned team member
      if (task.assignedTo.toString() !== user.id) {
        return {
          success: false,
          message: "Only the assigned member can request approval.",
          task: null,
        };
      }

      // ✅ Ensure task is in "In Progress" before approval request
      if (task.status !== "Done") {
        return {
          success: false,
          message: "Only 'Done' tasks can be sent for approval.",
          task: null,
        };
      }

      // ✅ Change status to "Pending Approval"
      task.status = "Pending Approval";
      task.history.push({
        updatedBy: user.id,
        oldStatus: task.status,
        newStatus: "Pending Approval",
      });

      await task.save();

      // ✅ Find Project Manager or Team Lead who assigned the task
      const taskCreator = await User.findById(task.createdBy);
      if (taskCreator) {
        await sendTaskApprovalRequestEmail({
          email: taskCreator.email,
          managerName: taskCreator.username,
          taskTitle: task.title,
          submittedBy: user.username,
        });
      }

      return { success: true, message: "Task sent for approval", task };
    } catch (error) {
      console.error("❌ Error sending task for approval:", error.message);
      return {
        success: false,
        message: `Failed to send for approval: ${error.message}`,
        task: null,
      };
    }
  },

  // ✅ Request Task Review (Member submits for final review)
  requestTaskReviewService: async ({ taskId }, user) => {
    try {
      if (!user) throw new ApolloError("Unauthorized!", "UNAUTHORIZED");

      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApolloError("Invalid task ID", "BAD_REQUEST");
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return { success: false, message: "Task not found", task: null };
      }

      // ✅ Check if the user is the assigned team member
      if (task.assignedTo.toString() !== user.id) {
        return {
          success: false,
          message: "Only the assigned member can request a review.",
          task: null,
        };
      }

      // ✅ Ensure task is in "Pending Approval" before requesting review
      if (task.status !== "Pending Approval") {
        return {
          success: false,
          message: "Only 'Pending Approval' tasks can be sent for review.",
          task: null,
        };
      }

      // ✅ Change status to "Under Review"
      task.status = "Pending Approval";
      task.history.push({
        updatedBy: user.id,
        oldStatus: task.status,
        newStatus: "Pending Approval",
      });

      await task.save();

      return { success: true, message: "Task sent for review", task };
    } catch (error) {
      console.error("❌ Error requesting task review:", error.message);
      return {
        success: false,
        message: `Failed to request review: ${error.message}`,
        task: null,
      };
    }
  },

  getMembersByProjectId: async (projectId) => {
    try {
      // Find users who are Team Members and belong to the given project
      const members = await User.find({ role: "Team_Member", projectId });

      if (!members || members.length === 0) {
        return {
          success: false,
          message: "No team members found for this project.",
          members: [],
        };
      }

      return {
        success: true,
        message: "Team members retrieved successfully.",
        members: members.map((user) => ({
          memberId: user._id,
          role: user.role, // Always "Team_Member"
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        })),
      };
    } catch (error) {
      console.error("Error fetching team members:", error);
      return {
        success: false,
        message: "An error occurred while fetching team members.",
        members: [],
      };
    }
  },

  // ✅ NEW: Close Task Service (for GitHub webhook integration)
  closeTask: async (taskId, closedBy) => {
    try {
      const task = await Task.findOne({ taskId });
      if (!task) throw new Error("Task not found");

      const oldStatus = task.status;
      task.status = "Completed"; // Or "Done" based on your enum
      task.closedBy = closedBy;
      task.history.push({
        updatedBy: closedBy, // Or use context.user.id if available
        updatedAt: new Date(),
        oldStatus,
        newStatus: task.status,
      });

      await task.save();

      // Optional: Emit Socket.io event for real-time notification (e.g., to lead/manager)
      // const io = require('../../server').io;  // If you expose io
      // io.emit('taskUpdated', { taskId: task._id, status: task.status });

      return {
        ...task._doc,
        id: task._id.toString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        // ... format other fields like in your other services
      };
    } catch (error) {
      throw new Error(`Error closing task: ${error.message}`);
    }
  },
};

module.exports = memberService;
