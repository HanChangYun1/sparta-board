import express from "express";
import postModel from "../schemas/posts.js";
const postRoute = express.Router();

//게시글 작성
postRoute.post("/", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (
    req.body == null ||
    req.params == null ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const createdPosts = await postModel.create({
    user,
    password,
    title,
    content,
  });

  res.json({ postReturn: createdPosts, message: "게시글을 생성하였습니다." });
});

//게시글 조회
postRoute.get("/", async (req, res) => {
  const selectcollect = await postModel.find({});
  const arr = [];
  for (let i = 0; i < selectcollect.length; i++) {
    const temp = {
      postId: selectcollect[i]._id,
      user: selectcollect[i].user,
      content: selectcollect[i].content,
      createdAt: selectcollect[i].createdAt,
    };
    arr.push(temp);
  }

  res.json({ data: [...arr] });
});

//게시글 상세 조회
postRoute.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;

  const selectDetail = await postModel.findById(_postId);
  if (_postId.length != 24) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const temp = {
    postId: selectDetail._id,
    user: selectDetail.user,
    title: selectDetail.title,
    content: selectDetail.content,
    createdAt: selectDetail.createdAt,
  };

  res.json({ data: [temp] });
});

//게시글 수정
postRoute.put("/:_postId", async (req, res, next) => {
  const { _postId } = req.params;
  const { password, title, content } = req.body;
  const existPost = await postModel.findOne({ postId: _postId });
  if (
    req.body == null ||
    _postId.length != 24 ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  console.log(existPost.password);
  if (existPost.password !== password) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  }
  const repair = await postModel.findOneAndUpdate(
    { _postId: req.params._id },
    {
      title: req.body.title,
      content: req.body.content,
    },
    { new: true }
  );
  res.json({ message: "게시글을 수정하였습니다." });
});

// 게시글 삭제
postRoute.delete("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;
  const existPost = await postModel.findOne({ postId: _postId });
  if (
    req.body == null ||
    _postId.length != 24 ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (existPost.password !== password) {
    return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  }

  await postModel.deleteOne({ _id: _postId });
  res.json({ message: "게시글을 삭제하였습니다." });
});

export default postRoute;
