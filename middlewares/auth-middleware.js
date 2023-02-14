// middlewares/auth-middleware.js

import jwt from "jsonwebtoken";
import Users from "../schemas/user.js";

// 사용자 인증 미들웨어
export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = (authorization ?? "").split(" ");
    //쿠키가 없을때
    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ message: "로그인 후 이용 가능한 기능입니다." });
    }

    const decodedToken = jwt.verify(token, "customized_secret_key");
    // console.log(decodedToken);
    const userId = decodedToken.userId;
    if (!decodedToken) {
      return res
        .status(403)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    const user = await Users.findOne({ _id: userId });
    // console.log(user);
    if (!user) {
      res.clearCookie("authorization");
      return res
        .status(401)
        .json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("authorization");
    return res.status(401).json({
      message: "비정상적인 요청입니다.",
    });
  }
};
