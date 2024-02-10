import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

import { errorHandler } from "./error.js";

dotenv.config();
const jwtToken: any = process.env.JWT_SECRET;

interface AuthenticatedRequest extends Request {
  user?: string;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, jwtToken, (err: any, user: any) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
