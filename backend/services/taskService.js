const Task = require("../models/Task");
const User = require("../models/User"); 

const taskService = {

    getTaskById : async (taskId) => {
        try{
            // 🔹 Find the task by ID
            const task = await Task.findById(taskId);

            if(!task){
                throw new Error("Task not found");
            }

            return ({
                ...task._doc,
                dueDate: task.dueDate ? task.dueDate.toISOString() : null,
                createdAt: task.createdAt ? task.createdAt.toISOString() : null,
                updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
                id: task._id.toString(),
                createdBy: task.createdBy._id.toString(),  // Convert createdBy to string
                assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null  // Convert assignedTo if exists
            });

        }catch(error){
            console.error("Error fetching task:", error);
            throw new Error("Failed to fetch task");
        }
    },
    
 getTasksByManager : async (managerId, projectId) => {
    try {
        console.log("Fetching tasks for Manager ID:", managerId);
        if (projectId) {
            console.log("Filtering by Project ID:", projectId);
        }

        const filter = { createdBy: managerId }; // Filter tasks by the manager who created them

        if (projectId) {
            filter.project = projectId; // If projectId is provided, filter tasks by project
        }

        console.log("Applied Filter:", filter);

        const tasks = await Task.find(filter)
            .populate("createdBy")
            .lean(); 
            
        console.log("Retrieved Tasks:", tasks);

        const userIds = tasks.map(task => task.assignedTo).filter(id => id); // Get unique user IDs
        const users = await User.find({ _id: { $in: userIds } }, "username").lean(); // Fetch usernames

        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        return tasks.map(task => ({
            ...task,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createdAt: task.createdAt ? task.createdAt.toISOString() : null,
            updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
            id: task._id.toString(),
            createdBy: task.createdBy._id.toString(),  // Convert createdBy to string
            assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null  ,
            assignName: task.assignedTo ? userMap[task.assignedTo.toString()] || "Unknown" : null, // Get username
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
        const userIds = tasks.map(task => task.assignedTo).filter(id => id); // Get unique user IDs
        const users = await User.find({ _id: { $in: userIds } }, "username").lean(); // Fetch usernames

        // Create a mapping of userId -> username
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        // Format and return tasks
        return tasks.map(task => ({
            ...task,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createdAt: task.createdAt ? task.createdAt.toISOString() : null,
            updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
            id: task._id.toString(),
            createdBy: task.createdBy._id.toString(),
            assignedTo: task.assignedTo ? task.assignedTo.toString() : null,
            assignName: task.assignedTo ? userMap[task.assignedTo.toString()] || "Unknown" : null,
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
},





getTasksForMember : async (memberId, projectLeadId, projectId) => {
    try {
        console.log("Fetching tasks assigned to Member ID:", memberId);
        if (projectLeadId) console.log("Filtering by Project Lead ID:", projectLeadId);
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
            const projectsManagedByLead = await Project.find({ lead: projectLeadId }).select("_id");

            const projectIds = projectsManagedByLead.map(project => project._id);
            filter.project = { $in: projectIds };
        }

        console.log("Applied Filter:", filter);

        // Fetch tasks with populated fields
        const tasks = await Task.find(filter)
            .populate("createdBy")   // Team Lead who created the task
            .populate("assignedTo")  // Team Member assigned to the task
            .lean();

        console.log("Retrieved Tasks:", tasks);

        // Format tasks to return only required fields
        return tasks.map(task => ({
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            createdBy: task.createdBy._id.toString(),
            assignedTo: task.assignedTo._id.toString(),
            dueDate: task.dueDate.toISOString(),
            project: task.project ? task.project.toString() : null,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
},

 getTasksForTeamLead : async (teamLeadId, projectManagerId,projectId) => {
    try {
        console.log("Fetching tasks assigned to Team Lead ID:", teamLeadId);
        if (projectId) console.log("Filtering by Project ID:", projectId);
        if (projectManagerId) console.log("Filtering by Project Manager ID:", projectManagerId);

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
            .populate("createdBy")   // The user who created the task (Project Manager)
            .lean();

        console.log("Retrieved Tasks:", tasks);

        const userIds = tasks.map(task => task.assignedTo).filter(id => id); // Get unique user IDs
        const users = await User.find({ _id: { $in: userIds } }, "username").lean(); // Fetch usernames

        // Create a mapping of userId -> username
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});
        // Format tasks to return only required fields
        return tasks.map(task => ({
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            createdBy: task.createdBy._id.toString(),  // Task creator (Project Manager)
            assignedTo: task.assignedTo._id.toString(), // Team Lead assigned to the task
            project: task.project ? task.project.toString() : null,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createdAt: task.createdAt ? task.createdAt.toISOString() : null,
            updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
            assignName: task.assignedTo ? userMap[task.assignedTo.toString()] || "Unknown" : null, // Get username
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
}
  
};
module.exports =  taskService ;
