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
    console.log(`Fetching chapters for book ID: ${bookId}`); // Log the book ID

    const chapters = await Chapter.find({ book: bookId });
    console.log("Chapters:", chapters);  // Log the chapters

    res.status(200).json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error); // Log the full error
    res.status(500).json({ message: "Error fetching chapters", error: error.message }); // Include error message
  }
});

// 📌 Get a single book by ID
router.get("/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
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

    const coverImage = req.file.path;

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

// Get all books, sorted by creation date (newest first)
router.get("/", async (req, res) => {
  try {
      const books = await Book.find().sort({ createdAt: -1 });
      res.json(books);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// 📌 Update a book by ID
router.put("/:bookId", upload.single("coverImage"), async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, description } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update fields
        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;

        // Handle cover image update
        if (req.file) {
            book.coverImage = req.file.path;
        }

        await book.save();
        res.status(200).json(book);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Error updating book", error });
    }
});


export default router;
