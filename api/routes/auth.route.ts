import express from "express";
import { googleSignIn, signin, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignIn);

export default router;
