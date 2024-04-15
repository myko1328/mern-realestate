import request from "supertest";
import test_server from "../../../test_setup";

describe("Auth Routes", () => {
  // Clean up after tests
  afterAll(async () => {
    // Clear all jest mocks
    jest.clearAllMocks();
    test_server.close();
  });

  it("should be able to create user", async () => {
    const response = await request(test_server)
      .post("/api/v1/auth/signup")
      .send({
        username: "myko4@outliant.com",
        email: "myko4@outliant.com",
        password: "myko123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email", "myko4@outliant.com");
    expect(response.body).toHaveProperty("username", "myko4@outliant.com");
  }, 20000);

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

  it("user should recieve 404 if credentials are invalid", async () => {
    const response = await request(test_server)
      .post("/api/v1/auth/signin")
      .send({
        email: "test@outliant.com",
        password: "myko123",
      });

    expect(response.status).toBe(404);
  }, 20000);
});
