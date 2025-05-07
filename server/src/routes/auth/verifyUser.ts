import express, { Request, Response } from "express";
import { authenticateRefreshToken } from "../../middleware/auth/authenticateRefreshToken.js";
import { authenticateAccessToken } from "../../middleware/auth/authenticateAccessToken.js";
import { createJwtToken } from "../../util/authTokens.js";
import { createClientUser } from "../../util/createClient.js";
import { JwtPayload } from "jsonwebtoken";
import { catchDrizzzzzleError } from "../../util/catchError.js";
import { db } from "../../config/db.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { hasDrizzzzzleError } from "../../util/checkError.js";
import { setAuthCookies } from "../../util/setResponseCookies.js";
import {
  clientVerification,
  staffVerification,
} from "../../controllers/auth/verify/verification.js";

const router = express.Router();

router
  .get(
    "/client/auth/verify",
    authenticateAccessToken,
    authenticateRefreshToken,
    clientVerification
  )
  .get(
    "/business/auth/verify",
    authenticateAccessToken,
    authenticateRefreshToken,
    staffVerification
  );

export default router;
