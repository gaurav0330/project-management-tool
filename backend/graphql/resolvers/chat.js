const { sendMessage, getMessages } = require("../../services/messageService");
const Message = require("../../models/Message");
const User = require("../../models/User");
const Group = require("../../models/Group");
const Project = require("../../models/Project");
const mongoose = require("mongoose");
const { createGroup, getGroups ,getGroupsByProjectId ,removeMemberFromGroup} = require("../../services/groupService");


const chatResolvers = {
  Query: {
    getGroups: async (_, { projectId }) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return await Group.find({ project: projectId }).populate("members teamLead");
    },
    getGroupsByProjectId: async (_, { projectId }) => {
      if (!projectId) throw new Error("Project ID is required");
    
      // Fetch groups filtered by projectId
      return await Group.find({ project: projectId }).populate("members teamLead");
    },
    
     
    getMessages: async (_, { groupId }) => await getMessages(groupId),
    getGroupsByLeadId: async (_, { leadId, projectId }) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
    
      // Fetch groups where the lead is the teamLead
      const groups = await Group.find({
        teamLead: leadId, // Filter groups where the lead is the teamLead
        project: projectId,
      }).populate("members teamLead");
    
      return groups;
    },
    getGroupsForLead: async (_, { leadId, projectId }) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
    
      // Fetch groups where the lead is the teamLead
      const teamLeadGroups = await Group.find({
        teamLead: leadId,
        project: projectId,
      }).populate("members teamLead");
    
      // Fetch the Leads group
      const leadsGroup = await Group.findOne({
        type: "leads",
        project: projectId,
      }).populate("members teamLead");
    
      // Fetch custom groups where the lead is invited as a member
      const customGroups = await Group.find({
        members: leadId,
        project: projectId,
      }).populate("members teamLead");
    
      // Combine all groups into a single array
      let allGroups = [
        ...teamLeadGroups,
        ...(leadsGroup ? [leadsGroup] : []),
        ...customGroups,
      ];
    
      // Deduplicate groups based on their `id`
      const uniqueGroups = allGroups.filter(
        (group, index, self) =>
          index === self.findIndex((g) => g.id.toString() === group.id.toString())
      );
    
      return uniqueGroups;
    },
    getGroupsByMemberId: async (_, { memberId, projectId }) => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return await Group.find({ 
        members: memberId, 
        project: projectId 
      }).populate("members teamLead");
    },
  },

  Mutation: {
    createGroup: async (_, { name, teamLeadId, memberIds }) => {
      const teamLead = await User.findById(teamLeadId);
      if (!teamLead) throw new Error("Team Lead not found");

      const members = await User.find({ _id: { $in: memberIds } });
      if (members.length !== memberIds.length) {
        throw new Error("One or more members not found");
      }

      const newGroup = await createGroup(name, teamLeadId, memberIds);

      return {
        id: newGroup._id.toString(), // ✅ Convert `_id` to string
        name: newGroup.name,
        teamLead: {
          id: teamLead.id.toString(), // ✅ Convert `_id` to string
          username: teamLead.username,
          email: teamLead.email,
          role: teamLead.role
        },
        members: members.map(member => ({
          id: member.id.toString(), // ✅ Convert `_id` to string
          username: member.username,
          email: member.email,
          role: member.role
        }))
      };
    },

    sendMessage: async (_, { groupId, senderId, content }) => {
      // Create a new message
      const message = await Message.create({
        group: groupId,
        sender: senderId,
        content,
      });

      // Populate the sender and group fields
      const populatedMessage = await message.populate('sender group');

      return {
        id: message._id.toString(), // Ensure the message ID is a string
        group: {
          id: populatedMessage.group._id.toString(), // Ensure the group ID is a string
          name: populatedMessage.group.name,
          // Add other group fields if necessary
        },
        sender: {
          id: populatedMessage.sender._id.toString(), // Ensure the sender ID is a string
          username: populatedMessage.sender.username,
          email: populatedMessage.sender.email,
          role: populatedMessage.sender.role,
        },
        content: message.content,
        createdAt: message.createdAt.toISOString(), // Ensure the date is formatted correctly
      };
    },

    createCustomGroup: async (_, { name, projectId, memberIds, creatorId }, { user }) => {
      try {
        console.log("🔍 Validating projectId:", projectId);
    
        // Validate project existence
        const project = await Project.findById(projectId);
        if (!project) {
          console.error("❌ Project not found for ID:", projectId);
          throw new Error("Project not found");
        }
        console.log("✅ Project found:", project);
    
        // Validate creator
        const creator = await User.findById(creatorId);
        if (!creator) {
          console.error("❌ Creator not found for ID:", creatorId);
          throw new Error("Creator not found");
        }
        console.log("✅ Creator validated:", creator);
    
        // ✅ Automatically add creatorId to memberIds if not already present
        const uniqueMemberIds = [...new Set([...memberIds, creatorId])]; // Use Set to avoid duplicates
    
        // Validate members (now including creator)
        const members = await User.find({ _id: { $in: uniqueMemberIds } });
        if (members.length !== uniqueMemberIds.length) {
          console.error("❌ One or more members not found:", uniqueMemberIds);
          throw new Error("One or more members not found");
        }
        console.log("✅ Members validated (including creator):", members);
    
        // Create the group with updated memberIds
        const newGroup = await Group.create({
          name,
          type: "custom",
          project: projectId,
          members: uniqueMemberIds, // Use the updated list
          creator: creatorId,
        });
    
        console.log("✅ Group created successfully:", newGroup);
    
        return {
          id: newGroup._id.toString(),
          name: newGroup.name,
          type: newGroup.type,
          project: newGroup.project.toString(),
        };
      } catch (error) {
        console.error("❌ Error in createCustomGroup:", error);
        throw new Error(error.message || "Failed to create custom group");
      }
    },
    
    removeMemberFromGroup: async (_, { groupId, memberId }, { user }) => {
      if (!user || !user._id) {
        throw new Error('Not authenticated');
      }
      return removeMemberFromGroup({
        groupId,
        memberId,
        userId: user._id,
      });
    },

    // notifyUserAddition: async (_, { projectId, userId, groupType }) => {
    //   const user = await User.findById(userId);
    //   if (!user) throw new Error("User not found");

    //   const group = await Group.findOne({ project: projectId, type: groupType });
    //   if (!group) throw new Error("Group not found");

    //   // Notify Project Manager
    //   const project = await Project.findById(projectId).populate("projectManager");
    //   const projectManager = project.projectManager;

    //   if (projectManager) {
    //     await sendEmail(
    //       projectManager.email,
    //       "New User Added to Group",
    //       `User ${user.username} has been added to the ${group.name} group.`
    //     );
    //   }

    //   return { success: true, message: "Notification sent successfully" };
    // },
  },
};

module.exports = chatResolvers;
