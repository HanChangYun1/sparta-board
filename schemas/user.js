import mongoose from "mongoose";
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    nickname: {
      // nickname 필드
      type: String,
      require: true,
      unique: true,
    },
    password: {
      // password 필드
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// 가상의 userId 값을 할당
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

// user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
UserSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("Users", UserSchema);
