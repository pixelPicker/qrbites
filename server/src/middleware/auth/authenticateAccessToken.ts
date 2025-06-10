import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const authenticateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) {
    res.status(400).send("Invalid request. Auth tokens are required");
    return;
  }
  const accessToken = req.cookies["access-token"];
  const requestToken = req.cookies["refresh-token"];

  if (requestToken === undefined) {
    res.status(403).send("Auth tokens are required");
    return;
  }

  if (accessToken === undefined) {
    next();
    return;
  }

  jwt.verify(
    accessToken,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded || typeof decoded === "string") {
        res.status(400).json({
          message: "Failed to authenticate user",
          error: err ?? "couldn't decode the jwt",
          accessToken: accessToken,
        });
        return;
      }
      
      res.locals.decoded = decoded;
      next();
      return;
    }
  );
};
