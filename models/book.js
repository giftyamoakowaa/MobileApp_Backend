import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true }); // Add this line!

const Book = mongoose.model("Book", bookSchema);

export default Book;
