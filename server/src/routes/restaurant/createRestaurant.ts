import express from "express";
import multer from "multer";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import { createRestaurant } from "../../controllers/restaurant/createRestaurantController.js";

const upload = multer({ limits: { fieldSize: 1024 * 1024 } });

const router = express.Router();

router.post(
  "/restaurant/create",
  authenticateAccessToken,
  authenticateRefreshToken,
  upload.single("logo"),
  createRestaurant
);

export default router;