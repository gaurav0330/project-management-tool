const http = require("http");
const socketIo = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("taskUpdated", (data) => {
    io.emit("updateDashboard", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
