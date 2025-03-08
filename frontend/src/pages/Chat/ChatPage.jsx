import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { useMutation, useQuery } from "@apollo/client";
import { GET_MESSAGES, SEND_MESSAGE } from "../../graphql/chatQueries";
import { useAuth } from "../../components/authContext";
import GroupList from "../../components/Group/GroupList";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";


const ChatPage = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [senderId, setSenderId] = useState(null);
  const [userName, setUserName] = useState("Unknown");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSenderId(decoded.id);
        setUserName(decoded.username || "Unknown");
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { groupId: selectedGroup?.id },
    skip: !selectedGroup,
  });

  useEffect(() => {
    if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup.id);
    }
    return () => {
      if (selectedGroup) {
        socket.emit("leaveGroup", selectedGroup.id);
      }
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (data) {
      setMessages(
        data.getMessages.map((msg) => ({
          ...msg,
          sender: {
            id: msg.sender?.id || "Unknown",
            username: msg.sender?.username || "Unknown",
          },
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedGroup || !senderId) return;

    socket.emit("sendMessage", {
      groupId: selectedGroup.id,
      senderId,
      userName,
      content: messageText,
    });

    setMessageText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Group List) */}
      <div className="w-1/4 bg-white border-r shadow-lg">
        <h2 className="p-4 text-lg font-semibold border-b bg-gray-50">Chats</h2>
        <GroupList onSelectGroup={setSelectedGroup} />
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1">
        {selectedGroup ? (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 text-white shadow bg-gradient-to-r from-blue-600 to-blue-500"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white border rounded-full">
                  <span className="text-lg font-bold text-blue-600">
                    {selectedGroup.name.charAt(0)}
                  </span>
                </div>
                <span className="text-lg font-semibold">{selectedGroup.name}</span>
              </div>
              <BsThreeDots className="text-xl cursor-pointer" />
            </motion.div>

            {/* Messages Section */}
            <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  className="flex-1 p-6 overflow-y-auto border border-gray-200 b200 bg-gray-"
  style={{
    backgroundImage: `url()`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "repeat",
  }}
>
  {loading ? (
    <p className="text-lg text-gray-400">Loading messages...</p>
  ) : (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg._id || msg.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`relative p-4 max-w-md text-lg rounded-xl border shadow-md ${
              msg.sender.id === senderId
                ? "ml-auto bg-blue-500 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            <span className="block text-base font-semibold">{msg.sender.username}</span>
            {msg.content}
            <span className="absolute text-sm text-gray-300 bottom-1 right-2">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )}
</motion.div>

{/* Input Box */}
<div className="flex items-center p-4 bg-white border-t">
  <motion.input
    type="text"
    value={messageText}
    onChange={(e) => setMessageText(e.target.value)}
    placeholder="Type a message..."
    onKeyDown={handleKeyPress}
    className="flex-1 p-4 text-base border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    whileFocus={{ scale: 1.02 }}
  />
  <motion.button
    onClick={handleSendMessage}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="p-3 ml-2 text-xl text-white transition bg-blue-500 border rounded-full shadow-md hover:bg-blue-600"
  >
    <FaPaperPlane />
  </motion.button>
</div>

          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center flex-1 h-10 text-gray-500"
          >
            Select a chat to start messaging
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
