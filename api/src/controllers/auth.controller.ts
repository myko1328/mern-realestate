import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/config";

import * as AuthService from "../services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await AuthService.signUp(req.body, next);

    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user: any = await AuthService.signIn(email, password, next);

    const token = jwt.sign({ id: user?.id }, env.JWT_SECRET);

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await AuthService.googleSignIn(req.body, next);

    res
      .cookie("access_token", user?.token, { httpOnly: true })
      .status(200)
      .json(user?.userData);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
