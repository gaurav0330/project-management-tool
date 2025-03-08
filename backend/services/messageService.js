const Message = require("../models/Message");

async function sendMessage(groupId, senderId, content) {
  const message = new Message({ group: groupId, sender: senderId, content });
  return await message.save();
}

async function getMessages(groupId) {
  return await Message.find({ group: groupId }).populate("sender");
}

module.exports = { sendMessage, getMessages };
