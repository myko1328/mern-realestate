import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
