import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import chapterRoutes from "./routes/ChapterRoutes.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/chapters", chapterRoutes);
app.use("/api/auth", authRouter); // Use auth routes


// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Story App API!");
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("likeChapter", (data) => {
    io.emit("updateLikes", data);
  });

  socket.on("newComment", (data) => {
    io.emit("updateComments", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4300;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
