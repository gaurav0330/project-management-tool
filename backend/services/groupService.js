const Group = require("../models/Group");

async function createGroup(name, teamLeadId, memberIds) {
  const group = new Group({ name, teamLead: teamLeadId, members: memberIds });
  return await group.save();
}

async function getGroups() {
  return await Group.find().populate("members teamLead");
}

module.exports = { createGroup, getGroups };
