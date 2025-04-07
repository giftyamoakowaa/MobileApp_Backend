import mongoose from "mongoose"; // Import mongoose to define the schema and interact with MongoDB

// Define the schema for a book
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Book title (required)
  author: { type: String, required: true }, // Author of the book (required)
  description: { type: String, required: true }, // Brief description of the book (required)
  coverImage: { type: String, required: true }, // Path to the cover image file (required)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], 
  // Array of ObjectId references to users who liked the book.
  // References the "User" model in the database.
  // Default value is an empty array.

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
      // The user who made the comment (referencing the User model)

      text: { type: String, required: true }, // The actual comment text
      createdAt: { type: Date, default: Date.now } // Timestamp of when the comment was made
    }
  ]
});

// Create the Book model from the schema
const Book = mongoose.model("Book", bookSchema);

export default Book; // Export the model to be used in other parts of the application
