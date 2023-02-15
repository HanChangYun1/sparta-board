import jwt from "jsonwebtoken";
import Users from "../schemas/user.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = (authorization ?? "").split(" ");

    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ message: "로그인 후 이용 가능한 기능입니다." });
    }

    const secretkey = process.env.SECRETKEY;
    const decodedToken = jwt.verify(token, secretkey);

    const userId = decodedToken.userId;
    if (!decodedToken) {
      return res
        .status(403)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    const user = await Users.findOne({ _id: userId });

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
