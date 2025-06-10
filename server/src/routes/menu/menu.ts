import express from "express";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import { renewTokens } from "../../middleware/auth/renewTokens.js";
import {
  addItemToMenu,
  deleteMenuItem,
  getAllMenuItems,
  getSingleMenuItem,
  updateMenuItem,
} from "../../controllers/menu/menuController.js";
import multer from "multer";

const upload = multer({ limits: { fileSize: 1024 * 1024 } });

const router = express.Router();

const withAuth = [authenticateAccessToken, authenticateRefreshToken, renewTokens];

router
  .get("/menu/:slug", ...withAuth, getAllMenuItems)
  .get("/menu/dish/:dishId", ...withAuth, getSingleMenuItem)
  .post("/menu", ...withAuth, upload.single("dishImage"), addItemToMenu)
  .put("/menu/update/:dishId", ...withAuth, upload.single("dishImage"), updateMenuItem)
  .delete("/menu/:id", ...withAuth, deleteMenuItem);

export default router;
