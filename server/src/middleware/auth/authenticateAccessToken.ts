import { Request, Response, NextFunction } from "express";
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

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    if (typeof decoded !== "string") {
      const userId = (decoded as JwtPayload).id;
      res.locals.userId = userId;
      next();
      return;
    } else {
      console.log("SOME MOFO USED STRING FOR TOKEN");
      throw new Error("Great day");
    }
  } catch (error) {
    const err = error as VerifyErrors;
    if (err.name === "TokenExpiredError") {
      next();
      return;
    }
    res.status(401).json({ message: "Failed to Authenticate user" });
    return;
  }
};
