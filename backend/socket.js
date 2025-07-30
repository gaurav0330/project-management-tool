const { sendMessage, getMessages } = require("./services/messageService");

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔵 New client connected:", socket.id);

    socket.on("joinGroup", (groupId) => {
      console.log(`Received joinGroup event for group: ${groupId}`);
      socket.join(groupId);
      console.log(`✅ User joined group: ${groupId}`);
    });

    socket.on("sendMessage", async ({ groupId, senderId, userName, content }) => {
      console.log(`🟢 Received sendMessage event for group: ${groupId}`);
      console.log(`📨 Message Content: ${content}`);
      console.log(`👤 Sender ID: ${senderId}, Username: ${userName}`);
       
      try {
        const message = await sendMessage(groupId, senderId, content);
        
        console.log("✅ Message saved to DB:", message);
    
        // Include `userName` in the broadcasted message
        const formattedMessage = {
          ...message._doc, // Spread message object
          sender: {
            id: senderId,
            username: userName, // Attach userName
          },
        };
    
        console.log("📡 Broadcasting message:", formattedMessage);
    
        io.to(groupId).emit("receiveMessage", formattedMessage);
    
        console.log(`🚀 Broadcasted message to group ${groupId}`);
      } catch (error) {
        console.error("❌ Error sending message:", error.message);
      }
    });
    
    

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
}

module.exports = setupSocket;

