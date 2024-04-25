import jwt from "jsonwebtoken";
import { Response } from "express";
import { verifyToken } from "../../utlis/verifyUser";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

jest.mock("../../utlis/error", () => ({
  errorHandler: jest.fn().mockImplementation((statusCode, message) => {
    const error = new Error(message) as any;
    error["statusCode"] = statusCode;
    return error;
  }),
}));

describe("verify user token function tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify token and add user to the request object", () => {
    const req = {
      cookies: { access_token: "validToken" },
    } as any;
    const res = {} as Response;
    const next = jest.fn();

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, { id: "user123" });
    });

    verifyToken(req as any, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      "secret",
      expect.any(Function)
    );
    expect(req.user).toEqual({ id: "user123" });
    expect(next).toHaveBeenCalledWith();
  });
});
