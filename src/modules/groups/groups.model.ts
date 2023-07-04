import mongoose from "mongoose";
import { IGroup } from "./groups.interface";

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      join_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  member_request: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      join_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  manager: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      role: {
        type: String,
        enum: ["admin", "mod"],
        default: "admin",
      },
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IGroup & mongoose.Document>(
  "groups",
  GroupSchema
);
