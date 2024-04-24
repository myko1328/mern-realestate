import User from "../../models/user.model";
import bcryptjs from "bcryptjs";
import * as UserListing from "../../services/user.service";
import { NextFunction } from "express";
import Listing from "../../models/listing.model";
import { UserInput } from "../../interfaces/UserInput";

jest.mock("../../models/user.model");
jest.mock("../../models/listing.model");
jest.mock("../../utlis/error", () => ({
  errorHandler: jest
    .fn()
    .mockImplementation((status, message) => ({ status, message })),
}));

jest.mock("bcryptjs");

describe("User service tests", () => {
  const nextMock = jest.fn() as NextFunction;

  const mockUser = {
    _id: "123",
    username: "testUser",
    email: "test@example.com",
    avatar: "url_to_avatar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user details when a valid user ID is provided", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserListing.getUser("123", nextMock);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(result).toEqual({
      _id: mockUser._id,
      username: mockUser.username,
      email: mockUser.email,
      avatar: mockUser.avatar,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should return user details when a valid user ID is provided", async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserListing.getUser("123", nextMock);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(result).toEqual({
      _id: mockUser._id,
      username: mockUser.username,
      email: mockUser.email,
      avatar: mockUser.avatar,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should call next with an error when no user is found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await UserListing.getUser("wrong-id", nextMock);

    expect(User.findById).toHaveBeenCalledWith("wrong-id");
    expect(nextMock).toHaveBeenCalledWith({
      status: 404,
      message: "User not found!",
    });
  });

  it("should handle errors and pass them to the next function", async () => {
    const mockError = new Error("Database error");
    (User.findById as jest.Mock).mockRejectedValue(mockError);

    await UserListing.getUser("123", nextMock);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(nextMock).toHaveBeenCalledWith(mockError);
  });

  it("should return listings for a given user ID", async () => {
    const mockListings = [
      { _id: "1", title: "Listing One", userRef: "user123" },
      { _id: "2", title: "Listing Two", userRef: "user123" },
    ];

    (Listing.find as jest.Mock).mockResolvedValue(mockListings);

    const result = await UserListing.getUserListings("user123");

    expect(Listing.find).toHaveBeenCalledWith({ userRef: "user123" });
    expect(result).toEqual(mockListings);
  });

  it("should throw an error if the database operation fails", async () => {
    const mockError = new Error("Database error");
    (Listing.find as jest.Mock).mockRejectedValue(mockError);

    await expect(UserListing.getUserListings("user123")).rejects.toThrow(
      "Database error"
    );

    expect(Listing.find).toHaveBeenCalledWith({ userRef: "user123" });
  });

  it("should throw an error if the database operation fails", async () => {
    const mockError = new Error("Database error");
    (Listing.find as jest.Mock).mockRejectedValue(mockError);

    await expect(UserListing.getUserListings("user123")).rejects.toThrow(
      "Database error"
    );

    expect(Listing.find).toHaveBeenCalledWith({ userRef: "user123" });
  });

  it("should successfully delete a user", async () => {
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(true); // Simulate successful deletion

    await UserListing.deleteUser("user123", nextMock);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("user123");
    expect(nextMock).not.toHaveBeenCalled(); // Ensure `next` is not called when operation is successful
  });

  it("should handle errors and pass them to the next function when deletion fails", async () => {
    const mockError = new Error("Database error");
    (User.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError); // Simulate an error during deletion
    const nextMock = jest.fn() as NextFunction;

    await UserListing.deleteUser("user123", nextMock);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("user123");
    expect(nextMock).toHaveBeenCalledWith(mockError); // Check if `next` is called with the error
  });

  it("should update user details without changing the password when no password is provided", async () => {
    const mockUserInput = {
      email: "updated@example.com",
      username: "updatedUser",
      avatar: "newAvatarUrl",
    };
    const mockUpdatedUser = {
      _id: "1",
      username: "updatedUser",
      email: "updated@example.com",
      avatar: "newAvatarUrl",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

    const result = await UserListing.updateUser(
      mockUserInput as UserInput,
      "1",
      nextMock
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { $set: { ...mockUserInput } },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedUser);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should hash and update the password when provided", async () => {
    const mockUserInput = {
      email: "updated@example.com",
      username: "updatedUser",
      password: "newPassword",
      avatar: "newAvatarUrl",
    };
    const mockUpdatedUser = {
      _id: "1",
      username: "updatedUser",
      email: "updated@example.com",
      avatar: "newAvatarUrl",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (bcryptjs.hashSync as jest.Mock).mockReturnValue("hashedNewPassword");
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

    const result = await UserListing.updateUser(mockUserInput, "1", nextMock);

    expect(bcryptjs.hashSync).toHaveBeenCalledWith("newPassword", 10);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      {
        $set: {
          username: mockUserInput.username,
          email: mockUserInput.email,
          newPassword: "hashedNewPassword",
          avatar: mockUserInput.avatar,
        },
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedUser);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("should handle errors and pass them to the next function when update fails", async () => {
    const mockUserInput = {
      email: "updated@example.com",
      username: "updatedUser",
      password: "newPassword",
      avatar: "newAvatarUrl",
    };
    const mockError = new Error("Database error");
    (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

    await UserListing.updateUser(mockUserInput, "1", nextMock);

    expect(User.findByIdAndUpdate).toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(mockError);
  });
});
