import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export const authenticateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.userId) {
    next();
    return;
  }
  const refreshToken = req.cookies["refresh-token"];
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    if (typeof decoded !== "string") {
      const userId = (decoded as JwtPayload).id;
      res.locals.userId = userId;
      res.locals.renewAccessToken = true;

      if (decoded.iat !== undefined && decoded.exp !== undefined) {
        const currentTime = Math.floor(Date.now() / 1000);
        const halfwayTime = decoded.iat + (decoded.exp - decoded.iat) / 2;
        const isHalfwayThroughExpiry = currentTime >= halfwayTime;

        if (isHalfwayThroughExpiry) {
          res.locals.renewRefreshToken;
        }
      }
      next();
      return;
    } else {
      console.log("SOME MOFO USED STRING FOR TOKEN");
      throw new Error("Great day");
    }
  } catch (error) {
    res.status(401).json({ message: "Failed to Authenticate user" });
    return;
  }
};
