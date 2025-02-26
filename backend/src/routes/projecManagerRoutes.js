const express = require("express");
const { 
  getProjectManagerDashboard, 
  createProject, 
  assignTeamLead, 
  getNotifications, 
  approveNotification 
} = require("../controllers/projectManagerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get Dashboard Overview
router.get("/dashboard", authMiddleware, roleMiddleware(["Project Manager"]), getProjectManagerDashboard);

// Create a New Project
router.post("/project", authMiddleware, roleMiddleware(["Project Manager"]), createProject);

// Assign Team Lead to Project
router.put("/project/:projectId/teamlead", authMiddleware, roleMiddleware(["Project Manager"]), assignTeamLead);

// Get Notifications & Approvals
router.get("/notifications", authMiddleware, roleMiddleware(["Project Manager"]), getNotifications);

// Approve Requests (Task Approvals, Project Changes)
router.put("/notification/:notificationId/approve", authMiddleware, roleMiddleware(["Project Manager"]), approveNotification);

module.exports = router;
