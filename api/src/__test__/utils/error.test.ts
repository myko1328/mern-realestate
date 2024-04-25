import { errorHandler } from "../../utlis/error";

describe("errorHandler function tests", () => {
  it("should create an error object with the provided status code and message", () => {
    const statusCode = 404;
    const message = "Not found";

    const error = errorHandler(statusCode, message);

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toEqual(statusCode);
    expect(error.message).toEqual(message);
  });

  it("should be able to handle different types of error messages and codes", () => {
    const tests = [
      { statusCode: 400, message: "Bad Request" },
      { statusCode: 500, message: "Internal Server Error" },
      { statusCode: 401, message: "Unauthorized" },
    ];

    tests.forEach((test) => {
      const error = errorHandler(test.statusCode, test.message);
      expect(error.statusCode).toEqual(test.statusCode);
      expect(error.message).toEqual(test.message);
    });
  });
});
