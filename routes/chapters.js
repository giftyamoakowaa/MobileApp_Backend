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


// PUT - Update an existing chapter
ChapterRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, chapterNumber } = req.body;

        // 1. Validation: Check if the chapter exists.
        const existingChapter = await Chapter.findById(id);
        if (!existingChapter) {
            return res.status(404).json({ message: "Chapter not found!" });
        }

        // 2. Update the chapter's fields.  Handles null/undefined values.
        existingChapter.title = title ?? existingChapter.title;
        existingChapter.content = content ?? existingChapter.content;
        existingChapter.chapterNumber = chapterNumber ?? existingChapter.chapterNumber;

        // 3. Save the updated chapter.
        const updatedChapter = await existingChapter.save();

        res.status(200).json(updatedChapter);
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).json({ message: "Error updating chapter", error: error.message }); // Include error message.
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