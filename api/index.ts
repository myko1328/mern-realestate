import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.route";
dotenv.config();

const mongoUri: any = process.env.mongo_uri;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err: any) => {
    console.log(err);
  });

const app = express();
const port = 3000;

app.use(express.json());
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
