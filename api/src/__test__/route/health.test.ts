import request from "supertest";
import test_server from "../../../test_setup";

describe("Health Route", () => {
  // Clean up after tests
  afterAll(async () => {
    // Clear all jest mocks
    test_server.close();
  });

  it("user should be able to get user details", async () => {
    const response = await request(test_server).get(`/health`);

    expect(response.status).toBe(200);
  }, 50000);
});
