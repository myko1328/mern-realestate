import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  test,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../../utlis/verifyUser";

const router = express.Router();

router.get("/test", test);

/**
 * @openapi
 * /api/v1/users/update/{id}:
 *   post:
 *     summary: Update User Account
 *     description: Updates the details of a specific user account. Requires authentication and users can only update their own account.
 *     operationId: updateUser
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user account to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's new username.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's new email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's new password.
 *               avatar:
 *                 type: string
 *                 description: URL to the user's new avatar image.
 *             example:
 *               username: "newUsername"
 *               email: "newEmail@example.com"
 *               password: "newPassword123"
 *               avatar: "https://example.com/newAvatar.jpg"
 *     responses:
 *       '200':
 *         description: User account updated successfully.
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
 *               example:
 *                 _id: "60d0fe4f5311236168a109cb"
 *                 username: "newUsername"
 *                 email: "newEmail@example.com"
 *                 avatar: "https://example.com/newAvatar.jpg"
 *                 createdAt: "2021-06-21T12:00:00Z"
 *                 updatedAt: "2021-06-22T15:00:00Z"
 *       '401':
 *         description: Unauthorized - User is not authenticated, token is invalid, or user is not the owner of the account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *       '500':
 *         description: Internal Server Error - Error during the update process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
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

router.post("/update/:id", verifyToken, updateUser);

/**
 * @openapi
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Delete User Account
 *     description: Deletes a specific user account. Requires authentication and users can only delete their own account.
 *     operationId: deleteUser
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user account to delete.
 *     responses:
 *       '200':
 *         description: User account has been deleted successfully. The access token cookie is also cleared.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User has been deleted!
 *         headers:
 *           Set-Cookie:
 *             description: Clears the access token cookie.
 *             schema:
 *               type: string
 *               example: "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
 *       '401':
 *         description: Unauthorized - User is not authenticated, token is invalid, or user is not the owner of the account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 *       '500':
 *         description: Internal Server Error - Error during the deletion process.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorModel'
 */
router.delete("/delete/:id", verifyToken, deleteUser);

/**
 * @openapi
 * /api/v1/users/listings/{id}:
 *   get:
 *     summary: Get User Listings
 *     description: Retrieves all listings created by a specific user. Requires authentication and user can only access their own listings.
 *     operationId: getUserListings
 *     tags:
 *       - Listings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user whose listings are to be retrieved.
 *     responses:
 *       '200':
 *         description: Successfully retrieved listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   address:
 *                     type: string
 *                   regularPrice:
 *                     type: number
 *                   discountPrice:
 *                     type: number
 *                   bathrooms:
 *                     type: integer
 *                   bedrooms:
 *                     type: integer
 *                   furnished:
 *                     type: boolean
 *                   parking:
 *                     type: boolean
 *                   type:
 *                     type: string
 *                   offer:
 *                     type: boolean
 *                   imageUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                   userRef:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *               example:
 *                 - _id: "60d0fe4f5311236168a109cb"
 *                   name: "Cozy Cottage"
 *                   description: "A cozy cottage in the city outskirts."
 *                   address: "123 Main St, Anytown"
 *                   regularPrice: 250000
 *                   discountPrice: 245000
 *                   bathrooms: 2
 *                   bedrooms: 3
 *                   furnished: true
 *                   parking: true
 *                   type: "sale"
 *                   offer: false
 *                   imageUrls:
 *                     - "https://example.com/image1.jpg"
 *                   userRef: "60d0fe4f5311236168a109ca"
 *                   createdAt: "2021-06-21T12:00:00Z"
 *                   updatedAt: "2021-06-22T15:00:00Z"
 *       '401':
 *         description: Unauthorized - User is not authenticated or does not have permission to view these listings.
 *       '404':
 *         description: Not Found - No listings found for the user.
 */
router.get("/listings/:id", verifyToken, getUserListings);

/**
 * @openapi
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get User Details
 *     description: Retrieves details of a specific user by their ID. Requires authentication.
 *     operationId: getUser
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     responses:
 *       '200':
 *         description: Successfully retrieved user details.
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
 *               example:
 *                 _id: "60d0fe4f5311236168a109ca"
 *                 username: "johndoe"
 *                 email: "johndoe@example.com"
 *                 avatar: "https://example.com/avatar.jpg"
 *                 createdAt: "2021-06-21T12:00:00Z"
 *                 updatedAt: "2021-06-22T15:00:00Z"
 *       '401':
 *         description: Unauthorized - No token provided or token is invalid.
 *       '404':
 *         description: User not found - The ID provided does not match any users.
 */
router.get("/:id", verifyToken, getUser);

export default router;
