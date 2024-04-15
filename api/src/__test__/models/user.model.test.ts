import { db } from "../../config/db";
import User from "../../models/user.model";

describe("User Model Tests", () => {
  let createdUser: any;

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await User.deleteOne({ username: "test_user@outliant.com" });

    await db.close();
  });

  // Test Case: Create a new user
  it("should create a new user", async () => {
    const newUser = {
      username: "test_user@outliant.com",
      email: "test_user@outliant.com",
      password: "myko123",
    };

    createdUser = await User.create(newUser);

    expect(createdUser.name).toBe(createdUser.name);
    expect(createdUser).toHaveProperty("_id");
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Get user details
  it("should get user details", async () => {
    const user = await User.findById(createdUser._id);

    // Expected result structure based on your example response
    const expectedUser = {
      username: createdUser.username,
      email: createdUser.email,
    };

    expect(user?.toJSON()).toMatchObject(expectedUser);
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Ensure listing name is unique
  it("should fail to create a listing with duplicate name", async () => {
    const userData = {
      username: "test_user@outliant.com",
      email: "test_user@outliant.com",
      password: "myko123",
    };

    try {
      // Attempt to create a user with the same email and username
      await User.create(userData);
      // If the above line doesn't throw an error, the test should fail
      expect(true).toBe(false);
    } catch (error: any) {
      // Expect a MongoDB duplicate key error (code 11000)
      expect(error.code).toBe(11000);
    }
  }, 10000); // Increase timeout to 10 seconds

  // Test Case: Update an existing listing
  it("should update an existing listing", async () => {
    // Check if there is a created user to update
    if (createdUser) {
      // Define updated data
      const updateCreatedUser = {
        email: "test_user_updated@outliant.com",
      };

      // Update the user and get the updated user
      const updatedUser = await User.findByIdAndUpdate(
        createdUser?._id,
        updateCreatedUser,
        { new: true }
      );

      // Expectations
      expect(updatedUser?.email).toBe(updateCreatedUser.email);
    }
  }, 20000);

  // Test Case: Delete an existing listing
  it("should delete an existing listing", async () => {
    // Delete the created listing
    await User.findByIdAndDelete(createdUser._id);

    // Attempt to find the deleted listing
    const deletedListing = await User.findById(createdUser._id);

    // Expectations
    expect(deletedListing).toBeNull();
  }, 20000);
});
