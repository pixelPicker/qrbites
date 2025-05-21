import { Response } from "express";
import { createJwtToken } from "./authTokens.js";
import { setAuthCookies } from "./setResponseCookies.js";

export function renewTokens(
  renewAccessToken: boolean,
  renewRefreshToken: boolean,
  res: Response,
  user: User | Staff,
  aud: "business" | "client"
) {
  if (renewAccessToken === true) {
    const accessToken = createJwtToken(user.id, aud, "access");
    setAuthCookies(accessToken, null, res);
  }

  if (renewRefreshToken === true) {
    const refreshToken = createJwtToken(user.id, aud, "refresh");
    setAuthCookies(null, refreshToken, res);
  }
}
