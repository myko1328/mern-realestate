import request from "supertest";
import test_server from "../../../test_setup";

describe("Auth Routes", () => {
  // Clean up after tests
  afterAll(async () => {
    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });

  it("user should be able to sign using google credentials", async () => {
    const response = await request(test_server)
      .post("/api/v1/auth/google")
      .send({
        email: "myko2_1@outliant.com",
        name: "",
        photo: "",
      });

    expect(response.status).toBe(200);
  }, 20000);

  it("user should be able to sign in", async () => {
    const response = await request(test_server)
      .post("/api/v1/auth/signin")
      .send({
        email: "myko2_1@outliant.com",
        password: "myko123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  }, 20000);
});
