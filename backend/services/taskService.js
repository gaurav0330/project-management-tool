const Task = require("../models/Task");

const taskService = {
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
            .populate("assignedTo")
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        console.log("Retrieved Tasks:", tasks);

        return tasks.map(task => ({
            ...task,
            id: task._id.toString(),
            createdBy: task.createdBy._id.toString(),  // Convert createdBy to string
            assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null  // Convert assignedTo if exists
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
},
 getTasksByTeamLead : async (teamLeadId, memberId, projectId) => {
    try {
        console.log("Fetching tasks created by Team Lead ID:", teamLeadId);
        if (memberId) console.log("Filtering by Member ID:", memberId);
        if (projectId) console.log("Filtering by Project ID:", projectId);

        // Build the filter query
        const filter = { createdBy: teamLeadId }; // Tasks created by the Team Lead

        if (memberId) {
            filter.assignedTo = memberId; // Filter tasks assigned to a specific Team Member
        }

        if (projectId) {
            filter.project = projectId; // Filter tasks by project if provided
        }

        console.log("Applied Filter:", filter);

        // Fetch tasks from the database
        const tasks = await Task.find(filter)
            .populate("createdBy")
            .populate("assignedTo")
            .lean(); // Convert Mongoose documents to plain JS objects

        console.log("Retrieved Tasks:", tasks);

        // Return formatted tasks
        return tasks.map(task => ({
            ...task,
            id: task._id.toString(),
            createdBy: task.createdBy._id.toString(), // Ensure createdBy is returned as an ID string
            assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null // Convert assignedTo if exists
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
            .populate("assignedTo")  // The Team Lead assigned to the task
            .lean();

        console.log("Retrieved Tasks:", tasks);

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
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
}
  
};
module.exports =  taskService ;
