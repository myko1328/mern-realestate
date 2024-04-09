import express, { Request, Response } from "express";

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     description: Health check endpoint for Mern Estate API
 *     operationId: healthCheck
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", (req: Request, res: Response) => {
  res.send({ status: "OK", timestamp: req.timestamp! });
});

export default router;
