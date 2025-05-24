import { Response } from "express";
import { createJwtToken } from "./authTokens.js";
import { setAuthCookies } from "./setResponseCookies.js";

export function renewTokens(
  renewAccessToken: boolean,
  renewRefreshToken: boolean,
  res: Response,
  id: string,
  aud: "business" | "client"
) {
  if (renewAccessToken === true) {
    const accessToken = createJwtToken(id, aud, "access");
    setAuthCookies(accessToken, null, res);
  }

  if (renewRefreshToken === true) {
    const refreshToken = createJwtToken(id, aud, "refresh");
    setAuthCookies(null, refreshToken, res);
  }
}
