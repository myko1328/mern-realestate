import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import path from "path";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import listingRouter from "./routes/listing.routes";
import healthRouter from "./routes/health.routes";
import swaggerRouter from "./routes/apidocs.routes";

import { db } from "./config/db";

const port = 3000;

app.use(express.json());

app.use(cookieParser());

db.connect();

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

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
