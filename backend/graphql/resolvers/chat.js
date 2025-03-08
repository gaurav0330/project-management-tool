const { createGroup, getGroups } = require("../../services/groupService");
const { sendMessage, getMessages } = require("../../services/messageService");
const Message = require("../../models/Message");
const User = require("../../models/User");
const Group = require("../../models/Group");

const chatResolvers = {
  Query: {
    getGroups: async () => await getGroups(),
    getMessages: async (_, { groupId }) => await getMessages(groupId),
    getGroupsByLeadId: async (_, { leadId }) => {
      return await Group.find({ teamLead: leadId }).populate("members teamLead");
    },
    getGroupsByMemberId: async (_, { memberId }) => {
      return await Group.find({ members: memberId }).populate("members teamLead");
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
  },
};

module.exports = chatResolvers;
