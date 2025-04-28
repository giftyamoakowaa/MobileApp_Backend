import express from "express";
import Chapter from "../models/chapter.js";
import Book from "../models/book.js";

const ChapterRouter = express.Router();

// POST - Add a new chapter
ChapterRouter.post("/", async (req, res) => {
    try {
        const { book, title, content, chapterNumber } = req.body;

        // Validate book existence
        const bookExists = await Book.findById(book);
        if (!bookExists) {
            return res.status(400).json({ message: "Book not found!" });
        }

        // Create new chapter
        const newChapter = new Chapter({ book, title, content, chapterNumber });
        await newChapter.save();

        res.status(201).json(newChapter);
    } catch (error) {
        res.status(500).json({ message: "Error adding chapter", error });
    }
});


// GET - Get chapters for a specific book
// ChapterRouter.get("/:bookId/chapters", async (req, res) => {
//     try {
//         const bookId = req.params.bookId;
//         const chapters = await Chapter.find({ book: bookId });
//         res.json(chapters);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching chapters", error });
//     }
// });

export default ChapterRouter;