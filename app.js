import dotenv from "dotenv";
import db from "./schemas/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/posts.js";
import userRoute from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db();

app.use("/api", [postRoute, userRoute]);

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
