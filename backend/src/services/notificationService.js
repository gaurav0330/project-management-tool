const Notification = require("../models/Notification");

const getPendingApprovals = async () => {
  return await Notification.find({ type: "approval", status: "pending" });
};

module.exports = { getPendingApprovals };
