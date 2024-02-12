import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.route";
import listingRouter from "./routes/listing.route";
import cookieParser from "cookie-parser";
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

app.use(cookieParser());

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listing", listingRouter);

app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
