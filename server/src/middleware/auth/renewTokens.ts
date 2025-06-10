import { Request, Response, NextFunction } from "express";
import { createJwtToken } from "../../util/authTokens.js";
import { setAuthCookies } from "../../util/setResponseCookies.js";

export const renewTokens = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const aud = res.locals.decoded.aud as string;
  const id = res.locals.decoded.id as string;
  if (aud !== "business" && aud !== "client") {
    res.status(403).send("Unauthorized");
    return;
  }
  if (res.locals.renewAccessToken === true) {
    const accessToken = createJwtToken(id, aud, "access");
    setAuthCookies(accessToken, null, res);
  }

  if (res.locals.renewRefreshToken === true) {
    const refreshToken = createJwtToken(id, aud, "refresh");
    setAuthCookies(null, refreshToken, res);
  }
  next();
  return;
};
