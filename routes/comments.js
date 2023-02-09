import express from "express";
import commentModel from "../schemas/comments.js";
import postModel from "../schemas/posts.js";
const commentRoute = express.Router();

//댓글 작성
commentRoute.post("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
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
  const createdComment = await commentModel.create({
    postId: _postId,
    user,
    password,
    content,
  });

  res.json({
    message: "댓글을 생성하였습니다.",
  });
});

//댓글 목록 조회
commentRoute.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;

  const selectcollect = await commentModel.findOne({ postId: _postId });
  if (
    req.body == null ||
    _postId.length != 24 ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }

  const arr = [];
  for (let i = 0; i < selectcollect.length; i++) {
    const temp = {
      commentId: selectcollect[i]._Id,
      user: selectcollect[i].user,
      content: selectcollect[i].content,
      createdAt: selectcollect[i].createdAt,
    };
    arr.push(temp);
  }

  res.json({ data: [...arr] });
});

//댓글 수정
commentRoute.put("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;
  com;
  const existComment = await commentModel.findOne({ commentId: _commentId });
  if (
    req.body == null ||
    _postId.length != 24 ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (content == null || Object.keys(content).length === 0) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }
  if (existComment.password != password) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
  const repair = await commentModel.findOneAndUpdate(
    req.params._commentId,
    {
      password: password,
      content: content,
    },
    { new: true }
  );
  res.json({ message: "댓글을 수정하였습니다." });
});

// 댓글 삭제
commentRoute.delete("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;
  const existComment = await commentModel.findById(_commentId);
  if (
    req.body == null ||
    _postId.length != 24 ||
    Object.keys(req.body).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  if (existComment.password != password) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }

  await commentModel.deleteOne({ _id: _commentId });
  res.json({ message: "게시글을 삭제하였습니다." });
});

export default commentRoute;
