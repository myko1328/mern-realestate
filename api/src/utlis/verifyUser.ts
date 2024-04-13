import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { errorHandler } from "./error";
import { env } from "../config/config";

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

  jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
