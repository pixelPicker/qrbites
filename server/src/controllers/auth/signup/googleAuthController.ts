import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { createJwtToken } from "../../../util/authTokens.js";
import {
  createClientStaff,
  createClientUser,
} from "../../../util/createClient.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";

export const clientGoogleSignin = (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken(user.id, "business", "access");
  const refreshToken = createJwtToken(user.id, "business", "refresh");
  setAuthCookies(accessToken, refreshToken, res);

  const clientUser = createClientUser({
    id: user.id,
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
  });

  res.status(202).json({ user: clientUser });
  return;
};

export const businessGoogleSignin = (req: Request, res: Response) => {
  const staff = req.user as Staff;
  if (!staff) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken(staff.id, "business", "access");
  const refreshToken = createJwtToken(staff.id, "business", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const clientStaff = createClientStaff({
    id: staff.id,
    username: staff.username,
    email: staff.email,
    profilePic: staff.profilePic,
    alias: staff.alias,
    role: staff.role,
  });

  res.status(202).json({ staff: clientStaff });
  return;
};
