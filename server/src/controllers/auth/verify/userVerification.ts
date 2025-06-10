import { JwtPayload } from "jsonwebtoken";
import { createJwtToken } from "../../../util/authTokens.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";
import { Request, Response } from "express";
import { catchDrizzzzzleError } from "../../../util/catchError.js";
import { db } from "../../../config/db.js";
import { staff, users } from "../../../db/schema.js";
import { hasDrizzzzzleError } from "../../../util/checkError.js";
import { eq } from "drizzle-orm";
import { createClientStaff, createClientUser } from "../../../util/createClient.js";
import { renewTokens } from "../../../middleware/auth/renewTokens.js";

export const clientVerification = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded as JwtPayload;
  const renewAccessToken = res.locals.renewAccessToken as boolean;
  const renewRefreshToken = res.locals.renewRefreshToken as boolean;
  
  const aud = decoded.aud;
  if(aud !== "client") {
    res.status(400).json({user: null, error: "Invalid token"})
    return;
  }

  const [fetchUserError, user] = await catchDrizzzzzleError(
    db.select().from(users).where(eq(users.id, decoded.id))
  );
  const fetchedUser = hasDrizzzzzleError(
    fetchUserError,
    user,
    res,
    null,
    null
  );
  if (!fetchedUser) {
    return;
  }

  if (renewAccessToken === true) {
    const accessToken = createJwtToken(
    fetchedUser[0].id,
    aud,
    "access",
    );
    setAuthCookies(accessToken, null, res);
  }
  
  if (renewRefreshToken === true) {
    const refreshToken = createJwtToken(
      fetchedUser[0].id,
      aud,
      "refresh",
    );
    setAuthCookies(null, refreshToken, res);
  }

  const clientUser = createClientUser(fetchedUser[0]);
  res.status(200).json({ user: clientUser });
  return;
}

export const staffVerification = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded as JwtPayload;
  
  const aud = decoded.aud;
  if(aud !== "business") {
    res.status(400).json({user: null, error: "Invalid token"})
    return;
  }

  const [fetchUserError, user] = await catchDrizzzzzleError(
    db.select().from(staff).where(eq(staff.id, decoded.id))
  );
  const fetchedUser = hasDrizzzzzleError(
    fetchUserError,
    user,
    res,
    null,
    null
  );
  if (!fetchedUser) {
    return;
  }

  const clientUser = createClientStaff(fetchedUser[0]);
  res.status(200).json({ user: clientUser });
  return;
}
