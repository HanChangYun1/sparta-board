import mongoose from "mongoose";
const { Schema } = mongoose;
const postSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    UserId: { type: Schema.Types.ObjectId, ref: "User" },
    nickname: { type: Schema.Types.String, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("postModel", postSchema);
