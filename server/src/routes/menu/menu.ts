import express from "express";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import {
  addItemToMenu,
  deleteMenuItem,
  getAllMenuItems,
  getSingleMenuItem,
  updateMenuItem,
} from "../../controllers/menu/menuController.js";
import multer from "multer";
const router = express.Router();

const upload = multer({ limits: { fileSize: 1024 * 1024 } });

router
  .use(authenticateAccessToken, authenticateRefreshToken)
  .get("/menu", getAllMenuItems)
  .get("/menu/:id", getSingleMenuItem)
  .post("/menu", upload.single("dishImage"), addItemToMenu)
  .put("/menu/:id", updateMenuItem)
  .delete("/menu/:id", deleteMenuItem);

export default router;
