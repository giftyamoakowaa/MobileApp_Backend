import express from "express";
import Chapter from "../models/chapter.js";
import Comment from "../models/Comment.js";
import User from "../models/user.js";

const router = express.Router();

// Like a chapter
router.post("/:chapterId/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const chapter = await Chapter.findById(req.params.chapterId);
    const user = await User.findById(userId);

    if (!chapter || !user) return res.status(404).json({ message: "Chapter or user not found" });

    if (user.likedChapters.includes(chapter._id)) {
      return res.status(400).json({ message: "Already liked this chapter" });
    }

    chapter.likes += 1;
    user.likedChapters.push(chapter._id);

    await chapter.save();
    await user.save();

    res.status(200).json({ message: "Chapter liked", likes: chapter.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment
router.post("/:chapterId/comment", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const chapter = await Chapter.findById(req.params.chapterId);
    const user = await User.findById(userId);

    if (!chapter || !user) return res.status(404).json({ message: "Chapter or user not found" });

    const comment = new Comment({ user: userId, chapter: chapter._id, text });
    await comment.save();

    chapter.comments.push(comment._id);
    await chapter.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all comments for a chapter
router.get("/:chapterId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ chapter: req.params.chapterId }).populate("user", "username");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
