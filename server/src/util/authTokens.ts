import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const createAccessToken = (id: string) => {
  const jwtid = uuidv4();
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
    jwtid,
    issuer: "https://havvon.serveo.net",
    audience: "https://app.havvon.com",
  });
};

export const createRefreshToken = (id: string) => {
  const jwtid = uuidv4();
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "90 days",
    jwtid,
    issuer: "https://havvon.serveo.net",
    audience: "https://app.havvon.com",
  });
};
