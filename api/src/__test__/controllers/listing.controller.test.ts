import * as ListingService from "../../services/listings.service";
import * as ListingController from "../../controllers/listing.controller";

import { Request, Response, NextFunction } from "express";
import { QueryParams } from "../../interfaces/QueryParams";

interface User {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

// Mock the UserService
jest.mock("../../services/listings.service");

describe("Listing Controller Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Resets the state of all mocks
  });

  it("should create a listing", async () => {
    const mockListingData = {
      name: "test_test",
      description: "test",
      address: "test",
      regularPrice: 500,
      discountPrice: 500,
      bathrooms: 5,
      bedrooms: 5,
      furnished: true,
      parking: true,
      type: "rent",
      offer: true,
      imageUrls: [
        "https://firebasestorage.googleapis.com/v0/b/mern-estate-cd7da.appspot.com/o/1708210646755Screenshot%202022-06-21%20145750.png?alt=media&token=580150ce-cd67-45a5-a01e-5893ba612c54",
      ],
      userRef: "661529018d4bd8556e8148ea",
    };

    const mockCreatedListing = {
      _id: "mockUserId",
      ...mockListingData,
    };

    const mockRequest = {
      body: mockListingData,
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Mock the createUser function of the UserService
    (ListingService.createListing as jest.Mock).mockResolvedValueOnce(
      mockCreatedListing
    );

    await ListingController.createListing(mockRequest, mockResponse, mockNext);
    // console.log((ListingService.createListing as jest.Mock).mock.calls);

    expect(ListingService.createListing).toHaveBeenCalledWith(
      mockListingData,
      expect.any(Function)
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it("should delete a listing", async () => {
    // Define the listing and user IDs
    const sampleListingId = "65d1416b08ecefc69c298ebd";
    const userId = "661529018d4bd8556e8148ea";

    // Mock the request
    const mockRequest: AuthenticatedRequest = {
      params: {
        id: sampleListingId, // This should be the ID of the listing to be deleted
      },
      user: {
        id: userId, // This is the ID of the user who is logged in and trying to delete the listing
      },
    } as unknown as AuthenticatedRequest;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Mock the deleteListing function of the ListingService
    jest.mock("../../services/listings.service", () => ({
      deleteListing: jest.fn().mockResolvedValueOnce(null),
    }));

    // Call the deleteListing controller
    await ListingController.deleteListing(mockRequest, mockResponse, mockNext);

    // Expectations
    expect(ListingService.deleteListing).toHaveBeenCalledWith(
      sampleListingId,
      userId,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith("Listing has been deleted!");
    expect(mockNext).not.toHaveBeenCalled(); // next should not be called unless there's an error
  });

  it("should successfully update a listing", async () => {
    const sampleListingId = "12345";
    const userId = "user123";

    // Mocking the request
    const mockRequest = {
      params: {
        id: sampleListingId,
      },
      user: {
        id: userId,
      },
      body: {
        title: "Updated Title", // Example of what might be updated
        description: "Updated Description",
      },
    } as unknown as AuthenticatedRequest;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Setup the service to return an updated listing
    const updatedListing = {
      _id: sampleListingId,
      userRef: userId,
      title: "Updated Title",
      description: "Updated Description",
    };

    (ListingService.updateListing as jest.Mock).mockResolvedValue(
      updatedListing
    );

    // Call the controller function
    await ListingController.updateListing(mockRequest, mockResponse, mockNext);

    // Assertions to verify the update went through correctly
    expect(ListingService.updateListing).toHaveBeenCalledWith(
      sampleListingId,
      userId,
      mockRequest.body,
      mockNext
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(updatedListing);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure `next` wasn't called with an error
  });

  it("should successfully retrieve a listing", async () => {
    const sampleListingId = "12345";
    const mockListing = {
      _id: sampleListingId,
      title: "Sample Listing",
      description: "A description of the sample listing",
      price: 300,
    };

    // Mocking the request
    const mockRequest = {
      params: {
        id: sampleListingId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Setup the service to return a listing
    (ListingService.getListing as jest.Mock).mockResolvedValue(mockListing);

    // Call the controller function
    await ListingController.getListing(mockRequest, mockResponse, mockNext);

    // Assertions to verify the retrieval went through correctly
    expect(ListingService.getListing).toHaveBeenCalledWith(
      sampleListingId,
      mockNext
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockListing);
    expect(mockNext).not.toHaveBeenCalled(); // Ensure `next` wasn't called with an error
  });

  it("should handle errors during listing retrieval", async () => {
    const mockRequest = {
      query: {},
    } as Request<{}, {}, {}, QueryParams>;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    // Simulate an error in the service
    const sampleError = new Error("Database error");
    (ListingService.getListings as jest.Mock).mockRejectedValue(sampleError);

    // Call the controller function
    await ListingController.getListings(mockRequest, mockResponse, mockNext);

    // Check that next was called with the error
    expect(mockNext).toHaveBeenCalledWith(sampleError);
  });
});
