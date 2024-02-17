import express from "express";
import { verifyToken } from "../utlis/verifyUser";
import {
  createListing,
  deleteListing,
  updateListing,
} from "../controllers/listing.controller";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);

export default router;
