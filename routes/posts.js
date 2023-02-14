import express from "express";
import postModel from "../schemas/posts.js";
import commentModel from "../schemas/comments.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import e from "express";
const postRoute = express.Router();

//게시글 작성
postRoute.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  console.log(res.locals.user);
  const { nickname } = res.locals.user;
  console.log(nickname);
  const { title, content } = req.body;

  try {
    if (!req.body) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (!title) {
      return res
        .status(412)
        .json({ message: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
      return res
        .status(412)
        .json({ message: "게시글 내용의 형식이 일치하지 않습니다." });
    }
    const createdPosts = await postModel.create({
      UserId: userId,
      nickname: nickname,
      title,
      content,
    });
    console.log(createdPosts);

    res.json({ postReturn: createdPosts, message: "게시글을 생성하였습니다." });
  } catch (error) {
    return res.status(400).json({ message: "게시글 작성에 실패하였습니다." });
  }
});

//게시글 조회
postRoute.get("/posts", async (req, res) => {
  const selectcollect = await postModel.find({});
  const arr = [];
  for (let i = 0; i < selectcollect.length; i++) {
    const temp = {
      postId: selectcollect[i]._id,
      UserId: selectcollect[i].UserId,
      nickname: selectcollect[i].nickname,
      title: selectcollect[i].title,
      createdAt: selectcollect[i].createdAt,
      updatedAt: selectcollect[i].updatedAt,
    };
    arr.push(temp);
  }

  res.json({ data: arr });
});

//게시글 상세 조회
postRoute.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  const selectDetail = await postModel.findById(postId);
  if (postId.length != 24) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const temp = {
    postId: selectDetail._id,
    UserId: selectDetail.UserId,
    nickname: selectDetail.nickname,
    title: selectDetail.title,
    content: selectDetail.content,
    createdAt: selectDetail.createdAt,
    updatedAt: selectDetail.updatedAt,
  };

  res.json({ data: [temp] });
});

//게시글 수정
postRoute.put("/posts/:postId", authMiddleware, async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;
  try {
    if (!req.body) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (!title) {
      return res
        .status(412)
        .json({ message: "게시글 제목의 형식이 일치하지 않습니다." });
    }
    if (!content) {
      return res
        .status(412)
        .json({ message: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    const existPost = await postModel.findOne({ _id: postId });
    if (!existPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    } else if (existPost.UserId != userId) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }
    console.log(existPost);
    await postModel.updateOne(
      { _id: postId },
      { $set: { title: title, content: content } },
      { new: true }
    );
    const rePost = await postModel.findOne({ _id: postId });

    if (existPost === rePost) {
      return res
        .status(401)
        .json({ message: "게시글이 정상적으로 수정되지 않았습니다." });
    }

    res.json({ message: "게시글을 수정하였습니다." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제
postRoute.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const existPost = await postModel.findOne({ _id: postId });
    if (!existPost) {
      return res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
    } else if (existPost.UserId != userId) {
      return res.status(401).json({ message: "권한이 없습니다." });
    }

    const deletePost = await postModel.deleteOne({ _id: postId });

    if (deletePost) {
      return res
        .status(401)
        .json({ message: "게시글이 정상적으로 삭제되지 않았습니다." });
    }

    res.json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "게시글 삭제에 실패하였습니다." });
  }
});

//댓글 작성
postRoute.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { nickname } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    if (!req.body) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const createdComment = await commentModel.create({
      PostId: postId,
      UserId: userId,
      nickname: nickname,
      comment,
    });
    console.log(createdComment);

    return res.status(201).json({ data: createdComment });
  } catch (error) {
    return res.status(400).json({ message: "댓글 작성에 실패하였습니다." });
  }
});

//댓글 목록 조회
postRoute.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const selectcollect = await commentModel.find({ PostId: postId });
    const arr = [];
    for (let i = 0; i < selectcollect.length; i++) {
      const temp = {
        commentId: selectcollect[i]._Id,
        postId: selectcollect[i].PostId,
        UserId: selectcollect[i].UserId,
        nickname: selectcollect[i].nickname,
        comment: selectcollect[i].comment,
        createdAt: selectcollect[i].createdAt,
        updatedAt: selectcollect[i].updatedAt,
      };
      arr.push(temp);
    }
    console.log(arr);

    res.json({ data: arr });
  } catch (error) {
    return res.status(400).json({ message: "댓글 조회에 실패하였습니다." });
  }
});

//댓글 수정
postRoute.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;
    const { comment } = req.body;

    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ message: "데이터 형식이 올바르지 않습니다." });
      }

      const existComment = await commentModel.findById(commentId);
      if (!existComment) {
        return res.status(400).json({ message: "댓글이 존재하지 않습니다." });
      } else if (existComment.UserId != userId) {
        return res.status(400).json({ message: "권한이 없습니다." });
      }

      const repair = await commentModel.findOneAndUpdate(
        req.params.commentId,
        {
          comment: comment,
        },
        { new: true }
      );
      if (existComment == repair) {
        return res
          .status(401)
          .json({ message: "댓글이 정상적으로 수정되지 않았습니다." });
      }
      res.json({ message: "댓글을 수정하였습니다." });
    } catch (error) {
      return res.status(400).json({ message: "댓글 수정에 실패하였습니다." });
    }
  }
);

// 댓글 삭제
postRoute.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    try {
      const existComment = await commentModel.findById(commentId);
      if (!existComment) {
        return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
      } else if (existComment.UserId != userId) {
        return res.status(401).json({ message: "권한이 없습니다." });
      }

      const deleteComment = await commentModel.deleteOne({ _id: commentId });

      res.json({ message: "게시글을 삭제하였습니다." });
    } catch (error) {
      return res.status(400).json({ message: "댓글 삭제에 실패하였습니다." });
    }
  }
);

export default postRoute;
