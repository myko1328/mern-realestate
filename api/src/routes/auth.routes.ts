import express from "express";
import {
  googleSignIn,
  signOut,
  signin,
  signup,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     summary: User Sign In
 *     description: Authenticates a user and returns a token set in an HTTP-only cookie.
 *     operationId: signin
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *             example:
 *               email: user@example.com
 *               password: password123
 *     responses:
 *       '200':
 *         description: Authentication successful. Returns user details and sets an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user's ID.
 *                 avatar:
 *                   type: string
 *                   description: URL to the user's avatar.
 *                 username:
 *                   type: string
 *                   description: The user's username.
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The user's email address.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the user was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the user information was last updated.
 *         headers:
 *           Set-Cookie:
 *             description: Sets the access token in an HTTP-only cookie.
 *             schema:
 *               type: string
 *               example: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDEzZGYxMjE5ZTRjNDM1ZGY4ZTc0ZiIsImlhdCI6MTYxODIxMjM0MH0.M11_vRI8ebbR-0K1sEJimzJJayWEp-r5yk4CsS1aC2A; Path=/; HttpOnly"
 *       '404':
 *         description: Wrong credentials provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 * components:
 *   schemas:
 *     ErrorModel:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Error message detailing what went wrong.
 */
router.post("/signin", signin);
router.post("/google", googleSignIn);
router.get("/signout", signOut);

export default router;
