import express from "express";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import { renewTokens } from "../../middleware/auth/renewTokens.js";
import {
  addTable,
  deleteTable,
  getAllTables,
  getSingleTable,
} from "../../controllers/tables/tablesController.js";

const router = express.Router();

const withAuth = [
  authenticateAccessToken,
  authenticateRefreshToken,
  renewTokens,
];

router
  .get("/tables/:slug", ...withAuth, getAllTables)
  .get("/tables/table/:tableId", ...withAuth, getSingleTable)
  .post("/tables", ...withAuth, addTable)
  .delete("/tables/:id", ...withAuth, deleteTable);

export default router;
