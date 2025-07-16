const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid"); // For unique message IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("new user", (username) => {
    socket.username = username;
    io.emit("user joined", username);
  });

  socket.on("chat message", (data) => {
    data.id = uuidv4();
    data.timestamp = Date.now();
    io.emit("chat message", data);
  });

  socket.on("delete message", (msgId) => {
    io.emit("delete message", msgId);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("user left", socket.username);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
