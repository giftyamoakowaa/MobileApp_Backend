import express from "express";
import Book from "../models/book.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import Chapter from "../models/chapter.js"; // don't forget this if you're using chapters

const router = express.Router();

// 📌 Like a book
router.post("/:bookId/like", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const book = await Book.findById(req.params.bookId);

    if (!book) return res.status(404).json({ message: "Book not found" });

    const alreadyLiked = book.likes.includes(userId);

    if (alreadyLiked) {
      book.likes = book.likes.filter(id => id.toString() !== userId);
    } else {
      book.likes.push(userId);
    }

    await book.save();
    res.status(200).json({ message: alreadyLiked ? "Book unliked" : "Book liked", likes: book.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Error liking book", error });
  }
});

// 📌 Comment on a book
router.post("/:bookId/comment", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.comments.push({ user: userId, text });
    await book.save();

    res.status(201).json({ message: "Comment added", comments: book.comments });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// 📌 Get comments of a book
router.get("/:bookId/comments", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("comments.user", "username");
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book.comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// 📌 Get chapters for a specific book
router.get("/:bookId/chapters", async (req, res) => {
  try {
    const { bookId } = req.params;
    const chapters = await Chapter.find({ book: bookId }).sort("chapterNumber");
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chapters", error });
  }
});

// 📌 Get a single book by ID
router.get("/api/books/:id", verifyToken, async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
});

// 📌 Test route
router.get("/test", (req, res) => {
  res.json({ message: "Books API is working!" });
});

// 📌 Create a new book
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, author, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required!" });
    }

    const coverImage = `/uploads/${req.file.filename}`;

    const newBook = new Book({
      title,
      author,
      description,
      coverImage,
      likes: [],
      comments: []
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error uploading book" });
  }
});

// 📌 Get all books
router.get("/api/books", verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});


export default router;
