import { Request, Response, NextFunction } from "express";
import bcrypts from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model";
import { errorHandler } from "../utlis/error";
import jwt from "jsonwebtoken";

dotenv.config();
const jwtToken: any = process.env.JWT_SECRET;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypts.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();

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
    const validUser = await User.findOne({ email: email });

    if (!validUser) {
      return next(errorHandler(404, "Wrong credentials!11"));
    }

    const validPassword = bcrypts.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(404, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, jwtToken);

    const user = {
      _id: validUser._id,
      username: validUser.username,
      email: validUser.email,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt,
    };

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};
