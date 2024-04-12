import { NextFunction } from "express";
import bcryptjs from "bcryptjs";

import { UserInput } from "../interfaces/UserInput";
import User from "../models/user.model";
import Listing from "../models/listing.model";
import { errorHandler } from "../utlis/error";

export const updateUser = async (
  body: UserInput,
  id: string,
  next: NextFunction
) => {
  const { password, email, username, avatar } = body;

  let newPassword;

  try {
    if (password) {
      newPassword = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          newPassword,
          avatar,
        },
      },
      { new: true }
    );

    const user = {
      _id: updatedUser?._id,
      username: updatedUser?.username,
      email: updatedUser?.email,
      avatar: updatedUser?.avatar,
      createdAt: updatedUser?.createdAt,
      updatedAt: updatedUser?.updatedAt,
    };

    return user;
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (id: string, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(id);
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (id: string) => {
  try {
    const listings = await Listing.find({ userRef: id });

    return listings;
  } catch (error: any) {
    throw Error(error);
  }
};

export const getUser = async (id: string, next: NextFunction) => {
  try {
    const user = await User.findById(id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const getUser = {
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      avatar: user?.avatar,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };

    return getUser;
  } catch (error) {
    next(error);
  }
};
