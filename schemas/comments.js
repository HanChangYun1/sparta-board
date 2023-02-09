import mongoose from "mongoose";
const { Schema } = mongoose;
const commentSchema = new Schema(
  {
    user: {
      type: String,
      requierd: true,
    },
    password: {
      type: String,
      requierd: true,
    },
    content: {
      type: String,
      requierd: true,
    },
    postId: { type: Schema.Types.ObjectId, ref: "postModel" },
  },
  { timestamps: true }
);

export default mongoose.model("commentModel", commentSchema);