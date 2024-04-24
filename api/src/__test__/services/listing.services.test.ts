import { NextFunction } from "express";

import * as ListingService from "../../services/listings.service";

import Listing from "../../models/listing.model";
import { errorHandler } from "../../utlis/error";
import { ListingInput } from "../../interfaces/ListingInput";

// Define an interface for the chainable methods you will mock
interface IMockQuery {
  sort: jest.Mock;
  limit: jest.Mock;
  skip: jest.Mock;
  exec: jest.Mock;
}

// Extending the Listing model mock
const mockQuery: IMockQuery = {
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue("mocked result"),
};

jest.mock("../../utlis/error", () => ({
  errorHandler: jest.fn().mockImplementation((status, message) => ({
    status,
    message,
  })),
}));

jest.mock("../../models/listing.model", () => ({
  find: jest.fn(() => mockQuery),
  findByIdAndUpdate: jest.fn(() => mockQuery),
}));

// Ensure you cast the mocked methods when you need to assert them in tests
describe("Listing service tests", () => {
  const nextMock: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clears any previous mocking behavior
  });

  it("fetches listings with correct parameters", async () => {
    const listings = await ListingService.getListings({
      limit: "10",
      startIndex: "1",
      offer: "true",
      type: "rent",
    });

    expect((Listing.find() as unknown as IMockQuery).sort).toHaveBeenCalledWith(
      { createdAt: "desc" }
    );
    expect(
      (Listing.find() as unknown as IMockQuery).limit
    ).toHaveBeenCalledWith(10);
    expect((Listing.find() as unknown as IMockQuery).skip).toHaveBeenCalledWith(
      1
    );
    expect(listings).toEqual(listings);
  });

  it("should return the listing if found", async () => {
    const mockListing = {
      _id: "123",
      title: "Sample Listing",
      description: "Sample Description",
      price: 1000,
    };

    Listing.findById = jest.fn().mockResolvedValue(mockListing);

    const listing = await ListingService.getListing("123", nextMock);

    expect(Listing.findById).toHaveBeenCalledWith("123");
    expect(listing).toEqual(mockListing);
    expect(nextMock).not.toHaveBeenCalled(); // Ensure no errors were forwarded
  });

  it("should call next with an error if listing not found", async () => {
    Listing.findById = jest.fn().mockResolvedValue(null); // Simulating no listing found

    await ListingService.getListing("123", nextMock); // `123` is the ID you're looking for

    expect(Listing.findById).toHaveBeenCalledWith("123");
    expect(errorHandler).toHaveBeenCalledWith(404, "Listing not found!");
    expect(nextMock).toHaveBeenCalledWith({
      status: 404,
      message: "Listing not found!",
    });
  });

  it("prevents updates to listings not owned by the user", async () => {
    const mockId = "123";
    const mockUserId = "user123";
    const unauthorizedUserId = "user999";
    const listingInput = {
      name: "Sample Listing",
      description: "A beautiful apartment.",
      address: "1234 Test St",
      regularPrice: 1200,
      discountPrice: 1100,
      bathrooms: 1,
      bedrooms: 2,
      furnished: true,
      parking: true,
      type: "rent",
      offer: true,
      imageUrls: ["http://example.com/image.jpg"],
      userRef: "user123",
    };

    const mockListing = {
      _id: mockId,
      userRef: mockUserId,
    };

    Listing.findById = jest.fn().mockResolvedValue(mockListing);

    await ListingService.updateListing(
      mockId,
      unauthorizedUserId,
      listingInput as ListingInput,
      nextMock
    );

    expect(Listing.findById).toHaveBeenCalledWith(mockId);
    expect(Listing.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: "You can only update your own listings!",
      })
    );
  });

  it("returns an error if the listing is not found", async () => {
    const mockId = "123";
    const mockUserId = "user123";
    const listingInput = {
      name: "Sample Listing",
      description: "A beautiful apartment.",
      address: "1234 Test St",
      regularPrice: 1200,
      discountPrice: 1100,
      bathrooms: 1,
      bedrooms: 2,
      furnished: true,
      parking: true,
      type: "rent",
      offer: true,
      imageUrls: ["http://example.com/image.jpg"],
      userRef: "user123",
    } as ListingInput;

    Listing.findById = jest.fn().mockResolvedValue(null);

    await ListingService.updateListing(
      mockId,
      mockUserId,
      listingInput,
      nextMock
    );

    expect(Listing.findById).toHaveBeenCalledWith(mockId);
    expect(Listing.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: "Listing not found!",
      })
    );
  });

  it("successfully deletes a listing when the user is the owner", async () => {
    const mockId = "123";
    const mockUserId = "user123";
    const mockListing = {
      _id: mockId,
      userRef: mockUserId,
    };

    Listing.findById = jest.fn().mockResolvedValue(mockListing);
    Listing.findByIdAndDelete = jest.fn().mockResolvedValue(mockListing);

    await ListingService.deleteListing(mockId, mockUserId, nextMock);

    expect(Listing.findById).toHaveBeenCalledWith(mockId);
    expect(Listing.findByIdAndDelete).toHaveBeenCalledWith(mockId);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("prevents deletion of listings not owned by the user", async () => {
    const mockId = "123";
    const mockUserId = "user123";
    const unauthorizedUserId = "user999";
    const mockListing = {
      _id: mockId,
      userRef: mockUserId,
    };

    Listing.findById = jest.fn().mockResolvedValue(mockListing);

    // Use unauthorizedUserId instead of mockUserId
    await ListingService.deleteListing(mockId, unauthorizedUserId, nextMock);

    expect(Listing.findById).toHaveBeenCalledWith(mockId);
    expect(Listing.findByIdAndDelete).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        message: "You can only delete your own listings!",
      })
    );
  });

  it("returns an error if the listing is not found", async () => {
    const mockId = "123";
    const mockUserId = "user123";

    Listing.findById = jest.fn().mockResolvedValue(null);

    await ListingService.deleteListing(mockId, mockUserId, nextMock);

    expect(Listing.findById).toHaveBeenCalledWith(mockId);
    expect(Listing.findByIdAndDelete).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: "Listing not found!",
      })
    );
  });

  it("successfully creates a new listing when no duplicate exists", async () => {
    const listingInput = {
      name: "Unique Listing",
      description: "A unique property",
      address: "1234 Unique St",
      regularPrice: 2500,
      discountPrice: 2400,
      bathrooms: 2,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: "rent",
      offer: false,
      imageUrls: ["http://example.com/unique.jpg"],
      userRef: "user123",
    };

    Listing.where = jest.fn().mockResolvedValue([]);
    Listing.create = jest.fn().mockResolvedValue({
      ...listingInput,
      _id: "newlyCreatedId",
    });

    const listing = await ListingService.createListing(
      listingInput as ListingInput,
      nextMock
    );

    expect(Listing.where).toHaveBeenCalledWith({ name: listingInput.name });
    expect(Listing.create).toHaveBeenCalledWith(listingInput);
    expect(listing).toEqual({
      ...listingInput,
      _id: "newlyCreatedId",
    });
    expect(nextMock).not.toHaveBeenCalled();
  });

  it("does not create a listing if one with the same name already exists", async () => {
    const listingInput = {
      name: "Existing Listing",
      description: "A property",
      address: "1234 Existing St",
      regularPrice: 2000,
      discountPrice: 1900,
      bathrooms: 1,
      bedrooms: 2,
      furnished: true,
      parking: true,
      type: "sale",
      offer: true,
      imageUrls: ["http://example.com/existing.jpg"],
      userRef: "user123",
    };

    Listing.where = jest.fn().mockResolvedValue([
      {
        _id: "existingId",
        name: "Existing Listing",
      },
    ]);

    await ListingService.createListing(listingInput as ListingInput, nextMock);

    expect(Listing.where).toHaveBeenCalledWith({ name: listingInput.name });
    expect(Listing.create).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalledWith({
      status: 404,
      message: "Listing already exists! Please create a new one.",
    });
  });

  it("handles errors during the listing creation process", async () => {
    const listingInput = {
      name: "Problematic Listing",
      description: "A problematic property",
      address: "1234 Problem St",
      regularPrice: 3000,
      discountPrice: 2900,
      bathrooms: 3,
      bedrooms: 4,
      furnished: false,
      parking: false,
      type: "rent",
      offer: false,
      imageUrls: ["http://example.com/problem.jpg"],
      userRef: "user123",
    };

    const mockError = new Error("Database failure");
    Listing.where = jest.fn().mockResolvedValue([]);
    Listing.create = jest.fn().mockRejectedValue(mockError);

    await ListingService.createListing(listingInput as ListingInput, nextMock);

    expect(Listing.where).toHaveBeenCalledWith({ name: listingInput.name });
    expect(Listing.create).toHaveBeenCalledWith(listingInput);
    expect(nextMock).toHaveBeenCalledWith(mockError);
  });
});
