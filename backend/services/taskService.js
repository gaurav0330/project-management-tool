const Task = require("../models/Task");

const getTasksByManager = async (managerId, projectId) => {
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
            createdBy: task.createdBy._id.toString(),  // Convert createdBy to string
            assignedTo: task.assignedTo ? task.assignedTo._id.toString() : null  // Convert assignedTo if exists
        }));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error(`Error fetching tasks: ${error.message}`);
    }
};

  

module.exports = { getTasksByManager };
