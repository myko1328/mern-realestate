import jwt from "jsonwebtoken";
import * as AuthService from "../../services/auth.service";
import * as AuthController from "../../controllers/auth.controller";

import { Request, Response, NextFunction } from "express";

jest.mock("../../services/auth.service");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"),
}));

describe("Auth Controller Tests", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.resetAllMocks(); // Resets the state of all mocks

    mockRequest = {} as Request;
    mockResponse = {
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn() as NextFunction;
  });

  it("should sign in a user and return a token", async () => {
    const mockUserData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      _id: "mockUserId",
      username: "testUser",
      email: mockUserData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Setup AuthService.signIn mock
    (AuthService.signIn as jest.Mock).mockResolvedValue(mockUser);

    // Mock Request and Response
    const mockRequest = {
      body: mockUserData,
    } as unknown as Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Execute the signin controller
    await AuthController.signin(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.signIn).toHaveBeenCalledWith(
      mockUserData.email,
      mockUserData.password,
      mockNext
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      expect.any(String)
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should handle user not found", async () => {
    const mockUserData = {
      email: "unknown@example.com",
      password: "password123",
    };

    // Setup AuthService signIn to simulate user not found
    (AuthService.signIn as jest.Mock).mockImplementation(
      (email, password, next) => {
        return next(new Error("Wrong credentials!")); // Simulating errorHandler being called
      }
    );

    const mockRequest = {
      body: mockUserData,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Execute the signin controller
    await AuthController.signin(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.signIn).toHaveBeenCalledWith(
      mockUserData.email,
      mockUserData.password,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error)); // Check if next was called with an error
    expect(mockResponse.status).not.toHaveBeenCalled(); // No response should be sent
  });

  it("should handle wrong password", async () => {
    const mockUserData = {
      email: "user@example.com",
      password: "wrongPassword",
    };

    // Setup AuthService signIn to simulate wrong password
    (AuthService.signIn as jest.Mock).mockImplementation(
      (email, password, next) => {
        return next(new Error("Wrong credentials!")); // Simulating errorHandler being called
      }
    );

    const mockRequest = {
      body: mockUserData,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Execute the signin controller
    await AuthController.signin(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.signIn).toHaveBeenCalledWith(
      mockUserData.email,
      mockUserData.password,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error)); // Check if next was called with an error
    expect(mockResponse.status).not.toHaveBeenCalled(); // Ensure no response is sent
  });

  it("should successfully create a new user", async () => {
    const mockUserData = {
      username: "newUser",
      email: "newuser@example.com",
      password: "securePassword123",
    };

    // Mock Request and Response
    const mockRequest = {
      body: mockUserData,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Setup AuthService.signUp to simulate successful user creation
    (AuthService.signUp as jest.Mock).mockResolvedValue(null); // Assume signUp doesn't return anything on success

    // Call the signup controller
    await AuthController.signup(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.signUp).toHaveBeenCalledWith(mockUserData, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "User created successfully!",
    });
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should handle errors during user registration", async () => {
    const mockUserData = {
      username: "existingUser",
      email: "existing@example.com",
      password: "password123",
    };

    const error = new Error("Email already exists");

    // Mock Request and Response
    const mockRequest = {
      body: mockUserData,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Setup AuthService.signUp to simulate an error
    (AuthService.signUp as jest.Mock).mockImplementation((body, next) => {
      return next(error); // Simulate error handling by calling next with an error
    });

    // Execute the signup controller
    await AuthController.signup(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.signUp).toHaveBeenCalledWith(mockUserData, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it("should successfully sign in an existing user via Google", async () => {
    const mockUserInput = {
      email: "googleuser@example.com",
      name: "Google User",
      photo: "http://example.com/photo.jpg",
    };

    const mockUserData = {
      _id: "1",
      username: "googleuser",
      avatar: "http://example.com/photo.jpg",
      email: "googleuser@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expectedResponse = {
      userData: mockUserData,
      token: "mockToken",
    };

    // Mock Request and Response
    const mockRequest = {
      body: mockUserInput,
    } as Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Setup AuthService.googleSignIn to simulate returning user data
    (AuthService.googleSignIn as jest.Mock).mockResolvedValue(expectedResponse);

    // Execute the googleSignIn controller
    await AuthController.googleSignIn(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(AuthService.googleSignIn).toHaveBeenCalledWith(
      mockUserInput,
      mockNext
    );
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      "access_token",
      "mockToken",
      { httpOnly: true }
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should successfully register and sign in a new user via Google", async () => {
    const mockNewUserInput = {
      email: "newgoogleuser@example.com",
      name: "New Google User",
      photo: "http://example.com/newphoto.jpg",
    };

    const newUserMockResponse = {
      userData: {
        _id: "2",
        username: "newgoogleuser",
        email: "newgoogleuser@example.com",
        avatar: "http://example.com/newphoto.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: "mockToken",
    };

    const mockRequest = {
      body: mockNewUserInput,
    } as Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    (AuthService.googleSignIn as jest.Mock).mockResolvedValue(
      newUserMockResponse
    );

    await AuthController.googleSignIn(mockRequest, mockResponse, mockNext);

    expect(AuthService.googleSignIn).toHaveBeenCalledWith(
      mockNewUserInput,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      newUserMockResponse.userData
    );
  });

  it("should handle errors during Google sign-in", async () => {
    const mockUserInput = {
      email: "erroruser@example.com",
      name: "Error User",
      photo: "http://example.com/errorphoto.jpg",
    };

    const error = new Error("Database connection error");

    const mockRequest = {
      body: mockUserInput,
    } as Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    (AuthService.googleSignIn as jest.Mock).mockImplementation((body, next) => {
      return next(error);
    });

    await AuthController.googleSignIn(mockRequest, mockResponse, mockNext);

    expect(AuthService.googleSignIn).toHaveBeenCalledWith(
      mockUserInput,
      mockNext
    );
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it("should clear the access token cookie and log the user out", async () => {
    // Execute the signOut controller
    await AuthController.signOut(mockRequest, mockResponse, mockNext);

    // Assertions to check if the cookie was cleared
    expect(mockResponse.clearCookie).toHaveBeenCalledWith("access_token");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith("User has been logged out!");
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should handle errors if an exception occurs", async () => {
    // Mocking an error scenario in response methods
    const error = new Error("Failed to clear cookie");
    (mockResponse.clearCookie as jest.Mock).mockImplementation(() => {
      throw error;
    });

    // Execute the signOut controller
    await AuthController.signOut(mockRequest, mockResponse, mockNext);

    // Check if the error was handled by next
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
