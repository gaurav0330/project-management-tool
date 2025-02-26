const express = require("express");
const { getTeamLeadDashboard , getTaskList } = require("../controllers/teamleadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware(["Team Lead"]), getTeamLeadDashboard);
router.get("/tasks", authMiddleware, getTaskList);

module.exports = router;
