import request from "supertest";
import test_server from "../../../test_setup";

// You can either test with a real token like this:
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTUyOTAxOGQ0YmQ4NTU2ZTgxNDhlYSIsImlhdCI6MTcxMzE3NzMyN30.dnDYpnRgHEYOntrP4KZ12EbPOF0WJBQ2c-5IiDt1_as";
// Alternatively:
const nonAdminToken = "YourNonAdminToken";

// OR
// Write a function that simulates an actual login process and extract the token from there
// And then store it in a variable for use in various test cases e.g:
// Assuming you have admin credentials for testing

// const adminCredentials = {
//   email: "admin@example.com",
//   password: "adminpassword",
// };

// Assuming you have a function to generate an authentication token
// const response = await request(test_server)
// .post("/api/v1/auth/signin")
// .send({
//   email: "myko2_1@outliant.com",
//   password: "myko123",
// });

// const cookies = response.header["set-cookie"][0]
// .split(",")
// .map((item) => item.split(";")[0]);
// const cookie = cookies.join(";").split("=")[1];

// ------------------> do the same for non admin user and store the token in
// its own variable

// Assuming you have a test product data
const testListing = {
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

const testUpdatedListing = {
  name: "test_test_updated",
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

const testExistingProduct = {
  name: "test123",
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

const userId = "661529018d4bd8556e8148ea";

describe("Listing Routes", () => {
  // Clean up after tests
  afterAll(async () => {
    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });

  it("user should be able to create listing", async () => {
    const response = await request(test_server)
      .post("/api/v1/listing/create")
      .set("Cookie", `access_token=${adminToken}`)
      .send(testListing);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userRef");
    expect(response.body).toHaveProperty("_id");
  }, 20000);

  it("user should not able to create listing if it already exists", async () => {
    const response = await request(test_server)
      .post("/api/v1/listing/create")
      .set("Cookie", `access_token=${adminToken}`)
      .send(testExistingProduct);

    expect(response.status).toBe(404);
  }, 50000);

  it("user should be able to get listing", async () => {
    const response = await request(test_server)
      .get(`/api/v1/listing/get/${userId}`)
      .set("Cookie", `access_token=${adminToken}`)
      .send(testExistingProduct);

    expect(response.status).toBe(200);
  }, 50000);

  it("user should be able to update listing", async () => {
    const response = await request(test_server)
      .post(`/api/v1/listing/get/${userId}`)
      .set("Cookie", `access_token=${adminToken}`)
      .send(testUpdatedListing);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userRef");
    expect(response.body).toHaveProperty("_id");
  }, 50000);

  it("user should be able to delete listing", async () => {
    const response = await request(test_server)
      .delete(`/api/v1/listing/get/${userId}`)
      .set("Cookie", `access_token=${adminToken}`);

    expect(response.status).toBe(200);
  }, 50000);

  it("user should be able to get all listing", async () => {
    const response = await request(test_server)
      .delete(`/api/v1/listing/get?offer=true&limit=4`)
      .set("Cookie", `access_token=${adminToken}`);

    expect(response.status).toBe(200);
  }, 50000);
});
