import * as UserService from "../../services/user.service";
import * as UserController from "../../controllers/user.controller";

import { Request, Response, NextFunction } from "express";

jest.mock("../../services/user.service");

describe("User Controller Tests", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: { id: "mockUserId" },
      params: { id: "mockUserId" },
      body: {
        email: "updated@example.com",
        username: "UpdatedUser",
        password: "newPassword123",
        avatar: "http://example.com/newavatar.jpg",
      },
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  it("should successfully retrieve a user by ID", async () => {
    const mockUser = {
      _id: "mockUserId",
      username: "testUser",
      email: "user@example.com",
      avatar: "http://example.com/avatar.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Setup UserService.getUser mock
    (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);

    // Execute the getUser controller
    await UserController.getUser(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.getUser).toHaveBeenCalledWith("mockUserId", mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should handle the scenario where the user is not found", async () => {
    // Setup UserService.getUser to simulate user not found
    (UserService.getUser as jest.Mock).mockImplementation((id, next) => {
      const error: any = new Error("User not found!");
      error.status = 404;
      next(error);
    });

    // Execute the getUser controller
    await UserController.getUser(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.getUser).toHaveBeenCalledWith("mockUserId", mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User not found!" })
    );
    // expect(mockResponse.status).not.toHaveBeenCalledWith(200); // Status should not be 200
  });

  it("should successfully retrieve listings for the authenticated user", async () => {
    const mockListings = [
      { id: "1", title: "Listing One", userRef: "mockUserId" },
      { id: "2", title: "Listing Two", userRef: "mockUserId" },
    ];

    // Setup UserService.getUserListings mock
    (UserService.getUserListings as jest.Mock).mockResolvedValue(mockListings);

    // Execute the getUserListings controller
    await UserController.getUserListings(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.getUserListings).toHaveBeenCalledWith("mockUserId");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockListings);
  });

  it("should prevent a user from viewing listings of another user", async () => {
    mockRequest = {
      user: { id: "mockUserId" },
      params: { id: "otherUserId" },
    } as unknown as Request;

    // Execute the getUserListings controller
    await UserController.getUserListings(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You can only view your own listings!",
      })
    );
  });

  it("should handle errors during the listing retrieval process", async () => {
    const error = new Error("Database connection error");
    (UserService.getUserListings as jest.Mock).mockRejectedValue(error);

    // Execute the getUserListings controller
    await UserController.getUserListings(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.getUserListings).toHaveBeenCalledWith("mockUserId");
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it("should successfully update the user details", async () => {
    const mockUpdatedUser = {
      _id: "mockUserId",
      username: "UpdatedUser",
      email: "updated@example.com",
      avatar: "http://example.com/newavatar.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Setup UserService.updateUser mock
    (UserService.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

    // Execute the updateUser controller
    await UserController.updateUser(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.updateUser).toHaveBeenCalledWith(
      mockRequest.body,
      "mockUserId",
      mockNext
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedUser);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should prevent a user from updating another user’s details", async () => {
    // Change the user ID in params to simulate an unauthorized attempt
    mockRequest.params.id = "otherUserId"; // Ensure this is different from mockRequest.user.id

    // Execute the updateUser controller
    await UserController.updateUser(mockRequest, mockResponse, mockNext);

    // Assertions
    expect(UserService.updateUser).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You can only update your own account!",
      })
    );
  });
});
