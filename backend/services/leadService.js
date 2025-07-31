
const Project = require("../models/Project");
const User = require("../models/User");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const { ApolloError } = require("apollo-server-express");
const { sendTeamAssignEmail , sendTaskAssignedEmail,sendTaskApprovalEmail,sendTaskRejectionEmail,sendTaskModificationEmail,sendTaskSubmissionEmail} = require("../services/emailService");
const shortid = require('shortid'); 
const Team = require("../models/Teams");

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

 // Fetch team member details for emails
 for (const member of formattedTeamMembers) {
    const teamMember = await User.findById(member.teamMemberId);
    if (teamMember) {
      await sendTeamAssignEmail({
        email: teamMember.email,
        teamMemberName: teamMember.username,
        teamLeadName: user.username,
        projectName: project.title,
        role: member.memberRole,
      });
    }
  }

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

    // ✅ Optimized query using aggregation (unchanged)
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
          _id: 1,  // Only return project ID (or more if needed)
          title: 1  // ✅ UPDATED: Include project title for taskId generation
        }
      }
    ]);

    if (project.length === 0) {
      return { success: false, message: "Assigned user is not a Team Member of this project.", task: null };
    }

    // ✅ Generate unique taskId (e.g., "TASK-PROJTITLE-ABC123")
    const projectTitlePrefix = project[0].title ? project[0].title.substring(0, 4).toUpperCase() : 'TASK';
    const uniqueId = shortid.generate();  // Generates a short unique string
    const taskId = `${projectTitlePrefix}-${uniqueId}`;

    // ✅ Create the task with new fields
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
      taskId,  // ✅ NEW: Set generated taskId
      closedBy: "",  // ✅ NEW: Default empty
      remarks: ""  // ✅ NEW: Default empty (if not provided)
    });

    await newTask.save();

    // ✅ Fetch Assigned Team Member Info (for email and assignName)
    const teamMember = await User.findById(assignedTo);
    if (!teamMember) {
      return {
        success: true,
        message: "Task assigned but team member not found for email notification.",
        task: newTask,
      };
    }

    // ✅ Send Email Notification (unchanged)
    await sendTaskAssignedEmail({
      email: teamMember.email,
      teamLeadName: teamMember.username,
      projectManager: user.username,
      projectName: project[0].title,  // Use from aggregation
      taskTitle: title,
      priority: priority || "Medium",
      dueDate: dueDate ? new Date(dueDate).toDateString() : "No due date",
    });

    // ✅ Compute and add assignName to response (not saved in DB, just for response)
    const taskResponse = {
      ...newTask.toObject(),
      id: newTask._id.toString(),
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : null,
      createdAt: newTask.createdAt.toISOString(),
      updatedAt: newTask.updatedAt ? newTask.updatedAt.toISOString() : null,
      assignName: teamMember.username || "Unknown",  // ✅ NEW: Computed field
    };

    return {
      success: true,
      message: "Task assigned successfully",
      task: taskResponse,  // ✅ UPDATED: Includes all queried fields
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
             teamLeadName: user.username,
             projectName: project.title,
             taskTitle: task.title,
             status: approved ? "Approved ✅" : "Rejected ❌",
             remarks: remarks || "No additional remarks",
         });


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

        await sendTaskRejectionEmail({
            email: teamMember.email,
            teamMemberName: teamMember.username,
            projectManager: user.username,
            projectName: project.title,
            taskTitle: task.title,
            reason,
        });

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

       // Fetch the Team Member details
       const teamMember = await User.findById(task.assignedTo);
       if (!teamMember) {
           return { success: true, message: "Requested task modifications but team member not found for email.", task };
       }

       // Send Email Notification
       await sendTaskModificationEmail({
           email: teamMember.email,
           teamMemberName: teamMember.username,
           reviewer: user.username,
           taskTitle: task.title,
           projectName: task.project ? (await Project.findById(task.project)).title : "Unknown Project",
           feedback,
       });

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

    // Ensure attachment is sane (optional)
    const upload = {
      name: attachment.name || null,
      size: attachment.size || null,
      type: attachment.type || null,
      // url: attachment.url || null, // If you use a URL field
    };
    task.attachments.push(upload);
    await task.save();

    // Optionally to return a plain object with id etc:
    // const plainTask = task.toObject();
    // plainTask.id = task._id.toString();

    return { success: true, message: "Attachment added!", task /* or plainTask */ };
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

      // Find the user who assigned the task (Project Manager or Team Lead)
      const taskCreator = await User.findById(task.createdBy);
      if (!taskCreator) {
          return { success: true, message: "Task sent for approval, but no email sent (assigner not found).", task };
      }

      // Send email notification
      await sendTaskSubmissionEmail({
          email: taskCreator.email,
          assignerName: taskCreator.username,
          taskTitle: task.title,
          submittedBy: user.username,
      });

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

      task.status = "Needs Revision";
      await task.save();

      return { success: true, message: "Task review requested!", task };
    } catch (error) {
      return { success: false, message: `Failed to request review: ${error.message}`, task: null };
    }
  },


  //Get Team Members by Team ID
  getTeamMembersByTeamId : async (teamId) => {
    const team = await Team.findById(teamId)
      .populate('members.teamMemberId', 'username email role ') // Adjust fields as needed
      .exec();
  
    if (!team) {
      throw new Error('Team not found');
    }
  
    return team.members;
  }
  
};

module.exports = leadService;