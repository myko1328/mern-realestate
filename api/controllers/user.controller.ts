import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utlis/error";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

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
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const user = {
      _id: updatedUser?._id,
      username: updatedUser?.username,
      email: updatedUser?.email,
      createdAt: updatedUser?.createdAt,
      updatedAt: updatedUser?.updatedAt,
    };

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    next(error);
  }
};
