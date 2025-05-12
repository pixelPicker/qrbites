import express from "express";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import { getRestaurant } from "../../controllers/restaurant/getRestaurantController.js";

const router = express.Router();

router.get(
  "/business/restaurant/get",
  authenticateAccessToken,
  authenticateRefreshToken,
  getRestaurant
);

export default router;
