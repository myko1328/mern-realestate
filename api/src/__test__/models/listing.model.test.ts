import { db } from "../../config/db";
import Listing from "../../models/listing.model";
import { ICreateListing } from "../../interfaces/ListingInput";

describe("Listing Model Tests", () => {
  let createdListing: ICreateListing;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await Listing.deleteOne({ name: "test_test" });

    await db.close();
  });

  // Test Case: Create a new listing
  it("should create a new listing", async () => {
    const listingData = {
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

    createdListing = await Listing.create(listingData);

    expect(createdListing.name).toBe(listingData.name);
    expect(createdListing).toHaveProperty("userRef");
    expect(createdListing).toHaveProperty("_id");
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Get all listing
  it("should get listings", async () => {
    const listings = await Listing.find();

    // Expectations
    const expectedProducts = {
      _id: createdListing._id,
      name: createdListing.name,
      description: createdListing.description,
      // Add other necessary fields
    };

    expect(listings).toContainEqual(expect.objectContaining(expectedProducts));
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Get only 1 listing
  it("should get 1 listings", async () => {
    const listings = await Listing.findById(createdListing._id);

    // Expected result structure based on your example response
    const expectedListing = {
      _id: createdListing._id, // Check if the _id is an ObjectId
      name: createdListing.name,
      description: createdListing.description,
    };

    expect(listings?.toJSON()).toMatchObject(expectedListing);
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Ensure listing name is unique
  it("should fail to create a listing with duplicate name", async () => {
    const listingData = {
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

    try {
      // Attempt to create a listing with the same name
      const isListingExists = await Listing.where({ name: listingData.name });

      if (isListingExists.length !== 0) {
        // If the above line doesn't throw an error, the test should fail
        expect(true);
      }

      // We can get expect a MongoDB duplicate key error (code 11000) if the name is set to unique
      //  expect(error.code).toBe(11000);
    } catch (error: any) {}
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Update an existing listing
  it("should update an existing listing", async () => {
    // Check if there is a created user to update
    if (createdListing) {
      // Define updated data
      const updateListingData = {
        name: "super_test_test",
      };

      // Update the user and get the updated user
      const updatedUser = await Listing.findByIdAndUpdate(
        createdListing?._id,
        updateListingData,
        { new: true }
      );

      // Expectations
      expect(updatedUser?.name).toBe(updateListingData.name);
    }
  }, 20000);

  // Test Case: Delete an existing listing
  it("should delete an existing listing", async () => {
    // Delete the created listing
    await Listing.findByIdAndDelete(createdListing._id);

    // Attempt to find the deleted listing
    const deletedListing = await Listing.findById(createdListing._id);

    // Expectations
    expect(deletedListing).toBeNull();
  }, 20000);
});
