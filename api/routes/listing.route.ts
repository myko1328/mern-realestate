import express from "express";
import { verifyToken } from "../utlis/verifyUser";
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
} from "../controllers/listing.controller";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);

export default router;
