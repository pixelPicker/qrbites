import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

interface tokenPayload {
  id: string;
  audience: "business" | "client";
  type: "access" | "refresh";
}

export const createJwtToken = ({ id, audience, type }: tokenPayload) => {
  const jwtid = uuidv4();
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: type === "access" ? "15m" : "90 days",
    jwtid,
    issuer: "qrbites",
    audience: audience,
  });
};
