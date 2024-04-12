import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";

import User from "../models/user.model";
import { errorHandler } from "../utils/error";
import { UserInput } from "../interfaces/UserInput";

import { env } from "../config/config";

export const signUp = async (body: UserInput, next: NextFunction) => {
  const { username, email, password } = body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  email: string,
  password: string,
  next: NextFunction
) => {
  try {
    const validUser = await User.findOne({ email: email });

    if (!validUser) {
      return next(errorHandler(404, "Wrong credentials!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(404, "Wrong credentials!"));

    const user: any = {
      _id: validUser._id,
      avatar: validUser?.avatar ?? "",
      username: validUser.username,
      email: validUser.email,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt,
    };

    return user;
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (body: UserInput, next: NextFunction) => {
  const { email, name, photo } = body;

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

      return { userData, token };
    }

    if (!isValidUser) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

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

      return { userData, token };
    }
  } catch (error) {
    next(error);
  }
};
