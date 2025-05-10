import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import ChapterRouter from "./routes/chapters.js";
import authRouter from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/Books.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://creative-alfajores-6c6850.netlify.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  }
});

app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cors({  // Added options here, too
    origin: "https://creative-alfajores-6c6850.netlify.app", //  *Also* use your Netlify URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/chapters", ChapterRouter); 
app.use("/api/auth", authRouter); // Use auth routes
app.use("/api/books", router); // Now `/api/books` works



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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
