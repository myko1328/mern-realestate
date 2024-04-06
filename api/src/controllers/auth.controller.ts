import { Request, Response, NextFunction } from "express";
import bcrypts from "bcryptjs";
import User from "../../models/user.model";
import { errorHandler } from "../../utlis/error";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/config";

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
      return next(errorHandler(404, "Wrong credentials!"));
    }
    const validPassword = bcrypts.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(404, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, env.JWT_SECRET);

    const user = {
      _id: validUser._id,
      avatar: validUser?.avatar ?? "",
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

export const googleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, photo } = req.body;

  const generatedName =
    String(name).split(" ").join("").toLowerCase() +
    Math.random().toString(36).slice(-4);

  try {
    const isValidUser = await User.findOne({ email: email });

    if (isValidUser) {
      const token = jwt.sign({ id: isValidUser._id }, env.JWT_SECRET);

      const userData = {
        _id: isValidUser._id,
        username: isValidUser.username,
        avatar: photo,
        email: isValidUser.email,
        createdAt: isValidUser.createdAt,
        updatedAt: isValidUser.updatedAt,
      };

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userData);
    }

    if (!isValidUser) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypts.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: generatedName,
        email,
        password: hashedPassword,
        avatar: photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, env.JWT_SECRET);

      const userData = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(userData);
    }
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
