const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");

const memberService = {
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
        return { success: false, message: "Only the assigned member can update this task.", task: null };
      }

      // ✅ Allowed Status Transitions
      const validStatuses = ["To Do", "In Progress", "Completed"];
      if (!validStatuses.includes(status)) {
        return { success: false, message: "Invalid task status", task: null };
      }

      // ✅ Save status change to history
      task.history.push({
        updatedBy: user.id,
        oldStatus: task.status,
        newStatus: status,
      });

      // ✅ Update the status
      task.status = status;
      await task.save();

      return { success: true, message: "Task status updated", task };
    } catch (error) {
      console.error("❌ Error updating task status:", error.message);
      return { success: false, message: `Failed to update task: ${error.message}`, task: null };
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
        return { success: false, message: "Only the assigned member can add attachments.", task: null };
      }

      // ✅ Add attachment
      task.attachments.push(attachment);
      await task.save();

      return { success: true, message: "Attachment added successfully", task };
    } catch (error) {
      console.error("❌ Error adding attachment:", error.message);
      return { success: false, message: `Failed to add attachment: ${error.message}`, task: null };
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
        return { success: false, message: "Only the assigned member can request approval.", task: null };
      }

      // ✅ Ensure task is in "In Progress" before approval request
      if (task.status !== "In Progress") {
        return { success: false, message: "Only 'In Progress' tasks can be sent for approval.", task: null };
      }

      // ✅ Change status to "Pending Approval"
      task.status = "Pending Approval";
      task.history.push({
        updatedBy: user.id,
        oldStatus: "In Progress",
        newStatus: "Pending Approval",
      });

      await task.save();

      return { success: true, message: "Task sent for approval", task };
    } catch (error) {
      console.error("❌ Error sending task for approval:", error.message);
      return { success: false, message: `Failed to send for approval: ${error.message}`, task: null };
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
        return { success: false, message: "Only the assigned member can request a review.", task: null };
      }

      // ✅ Ensure task is in "Pending Approval" before requesting review
      if (task.status !== "Pending Approval") {
        return { success: false, message: "Only 'Pending Approval' tasks can be sent for review.", task: null };
      }

      // ✅ Change status to "Under Review"
      task.status = "Under Review";
      task.history.push({
        updatedBy: user.id,
        oldStatus: "Pending Approval",
        newStatus: "Under Review",
      });

      await task.save();

      return { success: true, message: "Task sent for review", task };
    } catch (error) {
      console.error("❌ Error requesting task review:", error.message);
      return { success: false, message: `Failed to request review: ${error.message}`, task: null };
    }
  },

};

module.exports = memberService;