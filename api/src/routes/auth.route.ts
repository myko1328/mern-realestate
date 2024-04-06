import express from "express";
import {
  googleSignIn,
  signOut,
  signin,
  signup,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignIn);
router.get("/signout", signOut);

export default router;
