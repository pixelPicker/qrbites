import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const createJwtToken = (
  id: string,
  audience: "business" | "client",
  type: "access" | "refresh"
) => {
  const jwtid = uuidv4();
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: type === "access" ? "15m" : "90 days",
    jwtid,
    issuer: "qrbites",
    audience: audience,
  });
};

export const checkRefreshTokenHalfLife = (decoded: jwt.JwtPayload): boolean => {
  if (decoded.iat !== undefined && decoded.exp !== undefined) {
    const currentTime = Math.floor(Date.now() / 1000);
    const halfwayTime = decoded.iat + (decoded.exp - decoded.iat) / 2;
    const isHalfwayThroughExpiry = currentTime >= halfwayTime;

    if (isHalfwayThroughExpiry) {
      return true;
    }
    return false;
  }
  return false;
};
