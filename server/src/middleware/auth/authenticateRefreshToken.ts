import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { checkRefreshTokenHalfLife } from "../../util/authTokens.js";

export const authenticateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.decoded) {
    next();
    return;
  }
  const refreshToken = req.cookies["refresh-token"];

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded || typeof decoded === "string") {
        res.status(400).send("Failed to authenticate user" );
        return
      }
      res.locals.decoded = decoded;
      res.locals.renewAccessToken = true;
      res.locals.renewRefreshToken = checkRefreshTokenHalfLife(decoded);

      next();
      return;
    }
  );
};
