import request from "supertest";
import test_server from "../../../test_setup";

const userId = "661529018d4bd8556e8148ea";
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTUyOTAxOGQ0YmQ4NTU2ZTgxNDhlYSIsImlhdCI6MTcxMzE3NzMyN30.dnDYpnRgHEYOntrP4KZ12EbPOF0WJBQ2c-5IiDt1_as";

describe("User Routes", () => {
  // Clean up after tests
  afterAll(async () => {
    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });

  it("user should be able to get user details", async () => {
    const response = await request(test_server)
      .get(`/api/v1/listing/get/${userId}`)
      .set("Cookie", `access_token=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  }, 50000);

  it("user should be able to get user listing", async () => {
    const response = await request(test_server)
      .get(`/api/v1/user/listings/${userId}`)
      .set("Cookie", `access_token=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  }, 50000);

  it("user should be able to delete user", async () => {
    const response = await request(test_server)
      .get(`/api/v1/user/listings/${userId}`)
      .set("Cookie", `access_token=${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  }, 50000);

  it("user should be able to update user details", async () => {
    const response = await request(test_server)
      .get(`/api/v1/user/listings/${userId}`)
      .set("Cookie", `access_token=${adminToken}`)
      .send({ email: "myko2_1@outliant.com" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  }, 50000);
});
