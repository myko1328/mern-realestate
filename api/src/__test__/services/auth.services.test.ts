import jwt from "jsonwebtoken";
import { NextFunction } from "express";

import * as AuthService from "../../services/auth.service";

import bcryptjs from "bcryptjs";
import User from "../../models/user.model";
import { UserInput } from "../../interfaces/UserInput";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken"),
}));

jest.mock("../../models/user.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((userData) => ({
      ...userData,
      _id: "newUserId",
      save: jest.fn().mockResolvedValue(userData),
    })),
  },
}));

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn().mockReturnValue("hashedPassword"),
  compareSync: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utlis/error", () => ({
  errorHandler: jest.fn().mockImplementation((status, message) => ({
    status,
    message,
  })),
}));

describe("Auth service tests", () => {
  const nextMock: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clears any previous mocking behavior
  });

  it("successfully creates a new user", async () => {
    const userInput = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
    };

    // Call the signUp service
    await AuthService.signUp(userInput, nextMock);

    // Verify bcrypt hashSync was called correctly
    expect(bcryptjs.hashSync).toHaveBeenCalledWith(userInput.password, 10);
    // Verify User.create was called with the correct parameters
    expect(User.create).toHaveBeenCalledWith({
      username: userInput.username,
      email: userInput.email,
      password: "hashedPassword", // This should be the hashed password
    });
  });

  it("hashes the password before storing", async () => {
    const userInput = {
      username: "secureuser",
      email: "secure@example.com",
      password: "SecurePassword123",
    };

    await AuthService.signUp(userInput, nextMock);

    // Check that the password is hashed
    expect(bcryptjs.hashSync).toHaveBeenCalledWith(userInput.password, 10);
    // Check that the stored password is not the plaintext password
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: expect.not.stringContaining(userInput.password),
      })
    );
  });

  it("handles invalid input data", async () => {
    const invalidUserInput = {
      username: "", // Invalid username
      email: "notanemail", // Invalid email
      password: "123", // Invalid password
    };

    (User.create as jest.Mock).mockRejectedValue(
      new Error("Invalid input data")
    );

    const nextMock = jest.fn();

    await AuthService.signUp(invalidUserInput, nextMock);

    // Check if nextMock was called with an error
    expect(nextMock).toHaveBeenCalledWith(expect.any(Error));
  });

  it("successfully signs in a user with correct credentials", async () => {
    const mockUser = {
      _id: "1",
      username: "testUser",
      email: "test@example.com",
      password: "hashed_password",
      avatar: "avatar_url",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock findOne to simulate finding a user
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const user = await AuthService.signIn(
      "test@example.com",
      "password",
      nextMock
    );

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcryptjs.compareSync).toHaveBeenCalledWith(
      "password",
      "hashed_password"
    );
    expect(user).toMatchObject({
      _id: mockUser._id,
      username: mockUser.username,
      email: mockUser.email,
      avatar: mockUser.avatar,
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("returns an error if credentials are incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // No user found for the email
    const nextMock = jest.fn();

    await AuthService.signIn("wrong@example.com", "password", nextMock);

    expect(User.findOne).toHaveBeenCalledWith({ email: "wrong@example.com" });
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: "Wrong credentials!",
      })
    );
  });

  it("returns an error if the password is incorrect", async () => {
    const mockUser = {
      _id: "1",
      username: "testUser",
      email: "test@example.com",
      password: "hashed_password",
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compareSync as jest.Mock).mockReturnValue(false); // Incorrect password
    const nextMock = jest.fn();

    await AuthService.signIn("test@example.com", "wrongpassword", nextMock);

    expect(bcryptjs.compareSync).toHaveBeenCalledWith(
      "wrongpassword",
      "hashed_password"
    );
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: "Wrong credentials!",
      })
    );
  });

  it("should generate a token and return data for an existing user", async () => {
    const mockUser = {
      _id: "existingUserId",
      username: "existingUser",
      email: "existing@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const body = {
      email: "existing@example.com",
      name: "Existing User",
      photo: "url_to_photo",
    };
    const nextMock = jest.fn();

    const result = await AuthService.googleSignIn(body as UserInput, nextMock);

    expect(User.findOne).toHaveBeenCalledWith({ email: body.email });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      expect.any(String)
    );
    expect(result).toEqual({
      userData: {
        _id: mockUser._id,
        username: mockUser.username,
        avatar: body.photo,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
      token: "mockToken",
    });
  });

  it("should generate a token and return data for an existing user", async () => {
    const mockUser = {
      _id: "existingUserId",
      username: "existingUser",
      email: "existing@example.com",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const body = {
      email: "existing@example.com",
      name: "Existing User",
      photo: "url_to_photo",
    };
    const nextMock = jest.fn();

    const result = await AuthService.googleSignIn(body as UserInput, nextMock);

    expect(User.findOne).toHaveBeenCalledWith({ email: body.email });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      expect.any(String)
    );
    expect(result).toEqual({
      userData: {
        _id: mockUser._id,
        username: mockUser.username,
        avatar: body.photo,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
      token: "mockToken",
    });
  });

  it("should create a new user, generate a token, and return user data if the user does not exist", async () => {
    // Ensure no user is found
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const body = {
      email: "newuser@example.com",
      name: "New User",
      photo: "url_to_new_photo",
    };
    const nextMock = jest.fn();

    await AuthService.googleSignIn(body as UserInput, nextMock);

    expect(User.findOne).toHaveBeenCalledWith({ email: body.email });
    expect(User.create).toHaveBeenCalled();
  });
});
