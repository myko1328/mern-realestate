import { Request, Response } from "express";
import bcrypts from "bcryptjs";
import User from "../models/user.model";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypts.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
