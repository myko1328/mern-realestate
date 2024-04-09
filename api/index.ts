import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";

import userRouter from "./src/routes/user.routes";
import authRouter from "./src/routes/auth.routes";
import listingRouter from "./src/routes/listing.routes";
import healthRouter from "./src/routes/health.routes";

import { env } from "./src/config/config";

import openapiDoc from "./src/docs/openapi.json";

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

// const swaggerOptions: swaggerJSDoc.OAS3Options = {
//   definition: {
//     openapi: "3.0.3",
//     info: {
//       title: "MERN Estate API",
//       version: "1.0.0",
//     },
//   },
//   apis: ["**/*.ts"],
// };

app.use(express.json());

app.use(cookieParser());

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
// swagger-jsdoc -d api/src/routes/definition.yaml api/src/routes/*.ts \"api/src/routes/!(definition).yaml\" -o api/src/schemas/openapi.json
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/health", healthRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openapiDoc));

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
