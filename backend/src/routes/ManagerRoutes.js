const express = require("express");
const { getManagerDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/manager", authMiddleware, roleMiddleware(["Project Manager"]), getManagerDashboard);

module.exports = router;
