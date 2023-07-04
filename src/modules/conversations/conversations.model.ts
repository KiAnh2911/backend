import mongoose from "mongoose";
import { IConversation } from "./conversations.interface";

const ConversationSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  recent_date: {
    type: String,
    default: Date.now,
  },
  message: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      show_on_from: {
        type: Boolean,
        default: true,
      },
      show_on_to: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

export default mongoose.model<IConversation & mongoose.Document>(
  "conversation",
  ConversationSchema
);
