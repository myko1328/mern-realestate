import request from "supertest";
import test_server from "../../../test_setup";

describe("User Routes", () => {
  afterAll(() => {
    test_server.close(); // Make sure the server is closed after tests
  });
  it("should create a new user", async () => {
    const response = await request(test_server)
      .post("/api/v1/auth/signin") // Update the route path accordingly
      .send({
        email: "sdsd",
        password: "sdsdsd",
      });

    console.debug("sdsdsd", response);
  }, 20000);
});
