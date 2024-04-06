import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.routes";
import authRouter from "./src/routes/auth.route";
import listingRouter from "./src/routes/listing.route";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./src/config/config";

mongoose
  .connect(env.MONGO_URI)
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

app.use(express.static(path.join(path.resolve(), "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(path.resolve(), "client", "dist", "index.html"));
});

app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
