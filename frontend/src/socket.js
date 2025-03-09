import { io } from "socket.io-client";

const SOCKET_URL = "https://project-management-tool-af4j.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true, // Ensure it's connecting automatically
});

// Debugging connection
socket.on("connect", () => {
  console.log("🟢 Connected to WebSocket server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ WebSocket Connection Error:", error.message);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket server");
});

export default socket;
