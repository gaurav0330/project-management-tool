const Group = require("../models/Group");
const Project = require("../models/Project");
const Team = require("../models/Teams");
const User = require("../models/User");

// Create 'All Users' and 'Leads' groups for a project
async function createDefaultGroupsForProject(projectId) {
  const project = await Project.findById(projectId).populate("teamLeads.teamLeadId teams");
  if (!project) throw new Error("Project not found");

  // Get all leads
  const leadIds = project.teamLeads.map((l) => l.teamLeadId);

  // Get all team members from all teams
  const teams = await Team.find({ projectId });
  const memberIds = teams.flatMap((team) => team.members.map((m) => m.teamMemberId));

  // All users = leads + members (unique)
  const allUserIds = Array.from(new Set([...leadIds.map((id) => id.toString()), ...memberIds.map((id) => id.toString())]));

  // 1. All Users group
  await Group.create({
    name: "All Users",
    type: "all",
    project: projectId,
    members: allUserIds,
  });

  // 2. Leads group
  await Group.create({
    name: "Leads",
    type: "leads",
    project: projectId,
    members: leadIds,
  });

  // 3. Team-specific groups
  for (const team of teams) {
    const teamMemberIds = team.members.map((m) => m.teamMemberId);
    const teamGroupMembers = [team.leadId, ...teamMemberIds];

    await Group.create({
      name: `Team: ${team.teamName}`,
      type: "team",
      project: projectId,
      team: team._id,
      members: teamGroupMembers,
    });
  }
}

// Create a team-specific group
async function createTeamGroup(teamId) {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");

  // Team group: lead + members
  const memberIds = team.members.map(m => m.teamMemberId);
  const groupMembers = [team.leadId, ...memberIds];

  await Group.create({
    name: `Team: ${team.teamName}`,
    type: "team",
    project: team.projectId,
    team: teamId,
    members: groupMembers
  });
}

// Update groups when a user is added/removed from a project or team
async function updateGroupsOnUserChange({ projectId, teamId, userId, action }) {
  // Update All Users group
  const allGroup = await Group.findOne({ project: projectId, type: "all" });
  if (allGroup) {
    if (action === "add" && !allGroup.members.includes(userId)) {
      allGroup.members.push(userId);
      await allGroup.save();
    } else if (action === "remove") {
      allGroup.members = allGroup.members.filter((id) => id.toString() !== userId.toString());
      await allGroup.save();
    }
  }

  // Update Leads group (if user is a lead)
  const project = await Project.findById(projectId);
  const isLead = project.teamLeads.some((l) => l.teamLeadId.toString() === userId.toString());
  const leadsGroup = await Group.findOne({ project: projectId, type: "leads" });
  if (leadsGroup) {
    if (isLead && action === "add" && !leadsGroup.members.includes(userId)) {
      leadsGroup.members.push(userId);
      await leadsGroup.save();
    } else if (!isLead && action === "remove") {
      leadsGroup.members = leadsGroup.members.filter((id) => id.toString() !== userId.toString());
      await leadsGroup.save();
    }
  }

  // Update team group (if teamId provided)
  if (teamId) {
    const teamGroup = await Group.findOne({ team: teamId, type: "team" });
    if (teamGroup) {
      if (action === "add" && !teamGroup.members.includes(userId)) {
        teamGroup.members.push(userId);
        await teamGroup.save();
      } else if (action === "remove") {
        teamGroup.members = teamGroup.members.filter((id) => id.toString() !== userId.toString());
        await teamGroup.save();
      }
    }
  }
}

// Existing functions
async function createGroup(name, teamLeadId, memberIds) {
  const group = new Group({ name, teamLead: teamLeadId, members: memberIds });
  return await group.save();
}

async function getGroups() {
  return await Group.find().populate("members teamLead");
}

async function getGroupsByProjectId(projectId) {
  if (!projectId) throw new Error("Project ID is required");

  // Fetch groups filtered by projectId
  return await Group.find({ project: projectId }).populate("members teamLead");
}

//create custom groups
async function createCustomGroup(name, projectId, memberIds) {
  const group = new Group({
    name,
    type: "custom",
    project: projectId,
    members: memberIds,
  });
  return await group.save();
}


//removing from group
async function removeMemberFromGroup({ groupId, memberId, userId }) {
  const group = await Group.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (String(group.creator) !== String(userId)) {
    throw new Error('Only the group creator can remove members');
  }

  // Remove the member by filtering array (ObjectId to string comparison)
  group.members = group.members.filter(id => String(id) !== String(memberId));
  await group.save();

  // Convert ObjectIds to strings before returning
  const groupObj = group.toObject();
  groupObj.members = groupObj.members.map(id => id.toString());

  return groupObj;
}



module.exports = {
  createGroup,
  getGroupsByProjectId,
  getGroups,
  createDefaultGroupsForProject,
  createTeamGroup,
  updateGroupsOnUserChange,
  createCustomGroup,
  removeMemberFromGroup
};
