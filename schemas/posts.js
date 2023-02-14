import mongoose from "mongoose";
const { Schema } = mongoose;
const postSchema = new Schema(
  {
    title: {
      type: String,
      requierd: true,
    },
    content: {
      type: String,
      requierd: true,
    },
    UserId: { type: Schema.Types.ObjectId, ref: "User" },
    nickname: { type: Schema.Types.String, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("postModel", postSchema);
