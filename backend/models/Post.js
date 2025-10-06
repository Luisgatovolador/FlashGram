import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, default: "" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
