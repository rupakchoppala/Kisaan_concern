import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import db from "./config/db.js"; // ensure it connects DB

// ----------------- Port -----------------
const port = process.env.PORT || 5000;
if (!port) {
  console.error("Port number not found in environment variables!");
  process.exit(1);
}

// ----------------- HTTP + Socket.IO -----------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ----------------- Message Model -----------------
const messageSchema = new mongoose.Schema({
  sender: String, // "farmer" | "expert"
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// ----------------- Socket Events -----------------
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Send previous chat
  Message.find().sort({ timestamp: 1 }).then((msgs) => {
    socket.emit("loadMessages", msgs);
  });

  // New message
  socket.on("sendMessage", async (msg) => {
    const newMsg = new Message(msg);
    await newMsg.save();

    io.emit("receiveMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
// ----------------- Start Server -----------------
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
