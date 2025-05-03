import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
export const verifyMagicToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query["token"];
  if (typeof token !== "string") {
    res.status(401).json({ error: "Verification token required" });
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token has expired" });
      } else {
        res.status(401).json({ error: "Invalid token." });
      }
      return;
    }
    if(decoded) {
      if(typeof decoded !== "string") {
        const userId = decoded.id as string;
        res.locals.userId = userId;
        next();
      } else {
        res.status(401).json({error: "Invalid payload inside token"});
        return;
      }
    } else {
      res.status(401).json({error: "Invalid payload"});
      return
    }
  });
};
