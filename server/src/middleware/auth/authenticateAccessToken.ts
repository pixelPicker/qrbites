import { Request, Response, NextFunction } from "express";
import { access } from "fs";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const authenticateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.cookies).length === 0) {
    res.status(403).json({ message: "Auth tokens are required" });
    return;
  }
  const accessToken = req.cookies["access-token"];
  const requestToken = req.cookies["refresh-token"];

  if (accessToken == undefined || requestToken == undefined) {
    res.status(403).json({ message: "Auth tokens are required" });
    return;
  }

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded || typeof decoded === "string") {
        return res.status(400).json({ error: "Failed to authenticate user" });
      }
      res.locals.decoded = decoded;
      next();
    }
  );
};
