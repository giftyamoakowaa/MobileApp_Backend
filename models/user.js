import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    likedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  },
  { timestamps: true }
);




const User = mongoose.model("User", userSchema);
export default User;
