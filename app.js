import dotenv from "dotenv";
import db from "./schemas/index.js";
import express from "express";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comments.js";
// import musicRoute from "./routes/music.js";
dotenv.config();

// import commentRouter from "./routes/comments.js";
const app = express();

//나머지 불러오기
app.use(express.json());

//서버,db연결
db();

app.use("/posts", postRoute);
app.use("/comments", commentRoute);
// app.use("/music", musicRoute);

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
