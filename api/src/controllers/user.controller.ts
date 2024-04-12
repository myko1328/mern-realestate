import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/error";
import User from "../models/user.model.js";
import * as UserService from "../services/user.service";

interface User {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const test = (req: Request, res: Response) => {
  res.json({ message: "API route is working!" });
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    const user = await UserService.updateUser(req.body, req.params.id, next);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await UserService.deleteUser(req.params.id, next);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.id === req.params.id) {
    try {
      const listings = await UserService.getUserListings(req.params.id);
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.getUser(req.params.id, next);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
