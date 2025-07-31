const Task = require("../models/Task");
const User = require("../models/User");
const Profile = require("../models/Profile");

const taskService = {
  getTaskById: async (taskId) => {
    try {
      // 🔹 Find the task by ID
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      return {
        ...task._doc,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
        id: task._id.toString(),
        createdBy: task.createdBy._id.toString(), // Convert createdBy to string
        assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null, // Convert assignedTo if exists
      };
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task");
    }
  },

  getTasksByTeamLead: async (teamLeadId, memberId, projectId) => {
    try {
      console.log("Fetching tasks created by Team Lead ID:", teamLeadId);
      if (memberId) console.log("Filtering by Member ID:", memberId);
      if (projectId) console.log("Filtering by Project ID:", projectId);

      // Build the filter query
      const filter = { createdBy: teamLeadId };

      if (memberId) filter.assignedTo = memberId;
      if (projectId) filter.project = projectId;

      console.log("Applied Filter:", filter);

      // Fetch tasks matching filter
      const tasks = await Task.find(filter)
        .populate("createdBy", "username") // Populate creator's username (optional)
        .lean();

      console.log(`Retrieved ${tasks.length} Tasks`);

      // Extract unique assignedTo user IDs from tasks (exclude null/undefined)
      const userIds = [
        ...new Set(tasks.map((task) => task.assignedTo).filter(Boolean)),
      ];

      // Fetch users from database by IDs, only need username field
      const users = await User.find(
        { _id: { $in: userIds } },
        "username"
      ).lean();

      // Map userId -> username for easy lookup
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.username;
        return acc;
      }, {});

      // Format and return tasks with assignName filled from userMap
      return tasks.map((task) => ({
        ...task,
        id: task._id.toString(),
        // Convert ISO strings for dates if they exist
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
        createdBy: task.createdBy._id.toString(),
        assignedTo: task.assignedTo ? task.assignedTo.toString() : null,
        assignName: task.assignedTo
          ? userMap[task.assignedTo.toString()] || "Unknown"
          : null,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  },

  getTasksByTeamLead: async (teamLeadId, memberId, projectId) => {
    try {
      console.log("Fetching tasks created by Team Lead ID:", teamLeadId);
      if (memberId) console.log("Filtering by Member ID:", memberId);
      if (projectId) console.log("Filtering by Project ID:", projectId);

      // Build the filter query
      const filter = { createdBy: teamLeadId };

      if (memberId) {
        filter.assignedTo = memberId;
      }

      if (projectId) {
        filter.project = projectId;
      }

      console.log("Applied Filter:", filter);

      // Fetch tasks
      const tasks = await Task.find(filter)
        .populate("createdBy", "name") // Populate createdBy with name
        .lean();

      console.log("Retrieved Tasks:", tasks);

      // Fetch usernames for assignedTo users
      const userIds = tasks.map((task) => task.assignedTo).filter((id) => id); // Get unique user IDs
      const users = await User.find(
        { _id: { $in: userIds } },
        "username"
      ).lean(); // Fetch usernames

      // Create a mapping of userId -> username
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.username;
        return acc;
      }, {});

      // Format and return tasks
      return tasks.map((task) => ({
        ...task,
        id: task._id.toString(),
        createdBy: task.createdBy._id
          ? task.createdBy._id.toString()
          : task.createdBy.toString(),
        assignedTo: task.assignedTo ? task.assignedTo.toString() : null,
        assignName: task.assignedTo
          ? userMap[task.assignedTo.toString()] || "Unknown"
          : null,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
        attachments: task.attachments,
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  },

  getTasksForMember: async (memberId, projectLeadId, projectId) => {
    try {
      console.log("Fetching tasks assigned to Member ID:", memberId);
      if (projectLeadId)
        console.log("Filtering by Project Lead ID:", projectLeadId);
      if (projectId) console.log("Filtering by Project ID:", projectId);

      // Base filter: tasks assigned to the given member
      const filter = { assignedTo: memberId };

      // Optional: Filter by project
      if (projectId) {
        filter.project = projectId;
      }

      // Optional: Filter by project lead
      if (projectLeadId) {
        // Find projects managed by this lead
        const projectsManagedByLead = await Project.find({
          lead: projectLeadId,
        }).select("_id");

        const projectIds = projectsManagedByLead.map((project) => project._id);
        filter.project = { $in: projectIds };
      }

      console.log("Applied Filter:", filter);

      // Fetch tasks with populated fields
      const tasks = await Task.find(filter)
        .populate("createdBy") // Team Lead who created the task
        .populate("assignedTo") // Team Member assigned to the task
        .lean();

      console.log("Retrieved Tasks:", tasks);

      // Format tasks to return only required fields
      return tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,  
        createdBy: task.createdBy._id.toString(),
        assignedTo: task.assignedTo._id.toString(),
        dueDate: task.dueDate.toISOString(),
        project: task.project ? task.project.toString() : null,
        taskId: task.taskId || null, // Include taskId if exists
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  },

  getTasksForTeamLead: async (teamLeadId, projectManagerId, projectId) => {
    try {
      console.log("Fetching tasks assigned to Team Lead ID:", teamLeadId);
      if (projectId) console.log("Filtering by Project ID:", projectId);
      if (projectManagerId)
        console.log("Filtering by Project Manager ID:", projectManagerId);

      // Base filter: Tasks assigned to the given Team Lead
      const filter = { assignedTo: teamLeadId };

      // Optional: Filter by project
      if (projectId) {
        filter.project = projectId;
      }

      // Optional: Filter by project manager (who created the task)
      if (projectManagerId) {
        filter.createdBy = projectManagerId;
      }

      console.log("Applied Filter:", filter);

      // Fetch tasks with populated fields
      const tasks = await Task.find(filter)
        .populate("createdBy") // The user who created the task (Project Manager)
        .lean();

      console.log("Retrieved Tasks:", tasks);

      const userIds = tasks.map((task) => task.assignedTo).filter((id) => id); // Get unique user IDs
      const users = await User.find(
        { _id: { $in: userIds } },
        "username"
      ).lean(); // Fetch usernames

      // Create a mapping of userId -> username
      const userMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user.username;
        return acc;
      }, {});
      // Format tasks to return only required fields
      return tasks.map((task) => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        createdBy: task.createdBy._id.toString(), // Task creator (Project Manager)
        assignedTo: task.assignedTo._id.toString(), // Team Lead assigned to the task
        project: task.project ? task.project.toString() : null,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
        assignName: task.assignedTo
          ? userMap[task.assignedTo.toString()] || "Unknown"
          : null, // Get username
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  },
   getTasksByManager: async (managerId, projectId) => {
    try {
      console.log("Fetching tasks created by Manager ID:", managerId);
      if (projectId) console.log("Filtering by Project ID:", projectId);

      // Build the filter query: tasks created by this manager (project manager) and optionally for a project
      const filter = { createdBy: managerId };
      if (projectId) filter.project = projectId;

      console.log("Applied Filter:", filter);

      // Fetch tasks, with creator pop for 'username'
      const tasks = await Task.find(filter)
        .populate("createdBy", "username")
        .lean();

      console.log(`Retrieved ${tasks.length} Tasks`);

      // Get unique assigned user IDs
      const userIds = [
        ...new Set(tasks.map(task => task.assignedTo).filter(Boolean)),
      ];

      // Fetch usernames for assignedTo users
      const users = await User.find({ _id: { $in: userIds } }, "username").lean();
      const userMap = users.reduce((map, user) => {
        map[user._id.toString()] = user.username;
        return map;
      }, {});

      // Format and return tasks: Convert _id, ISO strings, and fill assignName
      return tasks.map(task => ({
        ...task,
        id: task._id.toString(),
        createdBy: task.createdBy?._id
          ? task.createdBy._id.toString()
          : task.createdBy.toString(),
        assignedTo: task.assignedTo ? task.assignedTo.toString() : null,
        assignName: task.assignedTo
          ? userMap[task.assignedTo.toString()] || "Unknown"
          : null,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
        // 🟢 Make sure attachments field is passed as-is (array of objects)
        attachments: Array.isArray(task.attachments)
          ? task.attachments.map(a => ({
              name: a.name ?? null,
              size: a.size ?? null,
              type: a.type ?? null,
              // url: a.url ?? null,  // Uncomment if you use file URLs
            }))
          : [],
        remarks: task.remarks ?? null,
      }));

    } catch (error) {
      console.error("Error fetching tasks (by manager):", error);
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
  },
  
 closeTask: async (taskId, closedBy) => {
  try {
    const task = await Task.findOne({ taskId });
    if (!task) throw new Error("Task not found");

    const oldStatus = task.status;
    task.status = "Pending Approval";  // Matches your enum; change to "Done" if preferred

    task.closedBy = closedBy;  // String (GitHub username) - this field is fine as string per your model

    // ✅ FIXED: Find User ID by closedBy (GitHub username) for history.updatedBy (ObjectId)
    
    // const updatedById = await profile.findOne({  });  // Assume username matches GitHub login

    const profile = await Profile.findOne({ GithubUsername : closedBy }).populate('user');  // Assume username matches GitHub login
    
    let updatedById = null;  // Default to null if no user found
    if (profile && profile.user) {
      updatedById = profile.user._id;  // Get User's ObjectId
    } else {
      console.warn(`No user/profile found for closedBy: ${closedBy} - using null for history`);
      // Optional: Create a guest user or skip history push if critical
    }

    task.history.push({
      updatedBy: updatedById,  // Now an ObjectId (or null if no match)
      updatedAt: new Date(),
      oldStatus,
      newStatus: task.status,
    });

    await task.save();  // This should now succeed without type errors

    // Optional: Emit Socket.io event for real-time frontend updates
    // const io = require('../server').io;  // Expose io in server.js via module.exports.io = io;
    // io.emit('taskUpdated', { taskId: task._id, status: task.status, closedBy });

    // Return formatted task (matches your other services)
    return {
      ...task._doc,
      id: task._id.toString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt ? task.createdAt.toISOString() : null,
      updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
      createdBy: task.createdBy ? task.createdBy.toString() : null,
      assignedTo: task.assignedTo ? task.assignedTo.toString() : null,
      // Add more fields if needed, e.g., attachments, remarks
    };
  } catch (error) {
    console.error("Error in closeTask:", error);  // ✅ ADDED: More logging for debugging
    throw new Error(`Error closing task: ${error.message}`);
  }
},


// Get All Tasks For User
getTasksAssignedToUser : async (userId) => {
  try {
    return await Task.find({ assignedTo: userId });
  } catch (error) {
    throw new Error("Error fetching tasks: " + error.message);
  }
}

};
module.exports = taskService;
