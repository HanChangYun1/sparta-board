import mongoose from "mongoose";
const { Schema } = mongoose;
const commentSchema = new Schema(
  {
    comment: {
      type: String,
      requierd: true,
    },
    PostId: { type: Schema.Types.ObjectId, ref: "postModel" },
    UserId: { type: Schema.Types.ObjectId, ref: "User" },
    nickname: { type: Schema.Types.String, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("commentModel", commentSchema);
