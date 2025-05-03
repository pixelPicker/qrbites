import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { createJwtToken } from "../../../util/authTokens.js";
import { createClientStaff, createClientUser } from "../../../util/createClient.js";

export const clientGoogleSignin = (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken({
    id: user.id,
    audience: "business",
    type: "access",
  });
  const refreshToken = createJwtToken({
    id: user.id,
    audience: "business",
    type: "refresh",
  });
  res.cookie("access-token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", refreshToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

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
  const accessToken = createJwtToken({
    id: staff.id,
    audience: "business",
    type: "access",
  });
  const refreshToken = createJwtToken({
    id: staff.id,
    audience: "business",
    type: "refresh",
  });
  res.cookie("access-token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", refreshToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

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
