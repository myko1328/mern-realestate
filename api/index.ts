import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./src/routes/user.routes";
import authRouter from "./src/routes/auth.routes";
import listingRouter from "./src/routes/listing.routes";
import healthRouter from "./src/routes/health.routes";
import swaggerRouter from "./src/routes/apidocs.routes";

import { db } from "./src/config/db";

db.connect();
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
app.use("/health", healthRouter);
app.use("/swagger", swaggerRouter);

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
