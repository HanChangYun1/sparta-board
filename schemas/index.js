import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI } = process.env;

const db = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to mongodb"))
    .catch((e) => console.error(e));
};

export default db;
