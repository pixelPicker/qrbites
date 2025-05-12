import { Request, Response } from "express";
import { createJwtToken } from "../../../util/authTokens.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";

export const clientGoogleSignin = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken(user.id, "client", "access");
  const refreshToken = createJwtToken(user.id, "client", "refresh");
  setAuthCookies(accessToken, refreshToken, res);

  // TODO: set the redirect url for client
  const clientRedirectUrl = new URL("http://localhost:5173")

  res.redirect(clientRedirectUrl.toString());
  return;
};

export const businessGoogleSignin = async (req: Request, res: Response) => {
  const staff = req.user as Staff;
  if (!staff) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken(staff.id, "business", "access");
  const refreshToken = createJwtToken(staff.id, "business", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const businessRedirectUrl = new URL(
    "http://localhost:5173/restaurant/create"
  );

  res.status(202).redirect(businessRedirectUrl.toString());
  return;
};
