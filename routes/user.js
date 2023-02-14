// routes/users.js
import express from "express";
import jwt from "jsonwebtoken";
import Users from "../schemas/user.js";
const userRoute = express.Router();

// 회원가입
userRoute.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;
  //조건식
  try {
    const rex = /[a-z][A-Z][0-9]/gi;
    const nicknameCheck = rex.test(nickname);

    if (!nicknameCheck || nickname.length < 3) {
      return res
        .status(412)
        .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
    }
    const isExistUser = await Users.findOne({ nickname });
    if (isExistUser) {
      return res.status(412).json({ errorMessage: "중복된 닉네임입니다." });
    }
    if (password !== confirm) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드가 일치하지 않습니다." });
    }
    if (password.length < 4) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드의 형식이 일치하지 않습니다." });
    }
    if (password.search(nickname) > -1) {
      return res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
    }

    // Users 테이블에 사용자를 추가합니다.
    await Users.create({ nickname, password });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

// 로그인
userRoute.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const user = await Users.findOne({ nickname });
    if (!user) {
      return res
        .status(412)
        .json({ message: "닉네임 또는 패스워드를 확인해주세요." });
    } else if (user.password !== password) {
      return res
        .status(412)
        .json({ message: "닉네임 또는 패스워드를 확인해주세요." });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "customized_secret_key"
    );
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인 성공" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

// 사용자 조회
userRoute.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await Users.findById(userId);
  const temp = {
    postId: user._id,
    nickname: user.nickname,
    password: user.password,
    createdAt: user.createdAt,
  };

  return res.status(200).json({ data: [temp] });
});

export default userRoute;
