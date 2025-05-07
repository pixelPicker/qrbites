import { Response } from "express";

export const setAuthCookies = (
  accessToken: string | null,
  refreshToken: string | null,
  res: Response
) => {
  if (accessToken) {
    res.cookie("access-token", accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }
  if (refreshToken) {
    res.cookie("refresh-token", refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  }
};
