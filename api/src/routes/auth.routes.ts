import express from "express";
import {
  googleSignIn,
  signOut,
  signin,
  signup,
} from "../controllers/auth.controller";

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user with the provided username, email, and password.
 *     operationId: signup
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *             example:
 *               username: "johndoe"
 *               email: "johndoe@example.com"
 *               password: "password123"
 *     responses:
 *       '201':
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: true
 *                 message: "User created successfully!"
 *       '400':
 *         description: Bad Request - Invalid request or data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *       '500':
 *         description: Internal Server Error - Error during the process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 */
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

/**
 * @openapi
 * /api/v1/auth/google:
 *   post:
 *     summary: Google Sign In
 *     description: Signs in a user using Google authentication. If the user does not exist, a new account is created.
 *     operationId: googleSignIn
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
 *               - name
 *               - photo
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *               name:
 *                 type: string
 *                 description: The user's full name.
 *               photo:
 *                 type: string
 *                 description: URL to the user's photo.
 *             example:
 *               email: "user@example.com"
 *               password: "password123"
 *               name: "John Doe"
 *               photo: "https://example.com/photo.jpg"
 *     responses:
 *       '200':
 *         description: Sign in successful or new user created. Returns user data and sets an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               _id: "66152a688d4bd8556e8148ee"
 *               username: "johndoe2023"
 *               email: "user@example.com"
 *               avatar: "https://example.com/photo.jpg"
 *               createdAt: "2024-04-09T11:45:44.584Z"
 *               updatedAt: "2024-04-09T11:45:44.584Z"
 *         headers:
 *           Set-Cookie:
 *             description: Sets the access token in an HTTP-only cookie.
 *             schema:
 *               type: string
 *               example: "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDEzZGYxMjE5ZTRjNDM1ZGY4ZTc0ZiIsImlhdCI6MTYxODIxMjM0MH0.M11_vRI8ebbR-0K1sEJimzJJayWEp-r5yk4CsS1aC2A; Path=/; HttpOnly"
 *       '400':
 *         description: Bad Request - Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *       '500':
 *         description: Internal Server Error - Error during the process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 */
router.post("/google", googleSignIn);

/**
 * @openapi
 * /api/v1/auth/signout:
 *   post:
 *     summary: User Sign Outasdasd
 *     description: Logs out the current user by clearing the access token cookie.
 *     operationId: signOut
 *     tags:
 *       - Auth
 *     responses:
 *       '200':
 *         description: User has been logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User has been logged out!
 *         headers:
 *           Set-Cookie:
 *             description: Clears the access token cookie.
 *             schema:
 *               type: string
 *               example: "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *       '500':
 *         description: Internal Server Error - Error during the process.
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
router.get("/signout", signOut);

export default router;
