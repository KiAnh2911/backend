import mongoose from "mongoose";
import { IPosts } from "./posts.interface";

export const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId },
      text: { type: String, require: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  shares: [
    {
      user: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IPosts & mongoose.Document>("post", PostSchema);
