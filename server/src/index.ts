import "dotenv/config";
import logger from "./config/logger.js";
import "./middleware/auth/passportGoogle.js";
import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import googleAuth from "./routes/auth/googleAuth.js";
import magicLinkAuth from "./routes/auth/magicLink.js";
import passport from "passport";

const app = express();

// logger init for api endpoints
app.use(pinoHttp({ logger }));

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["content-type"],
    credentials: true,
  })
);

// middleware init
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

// routes 
app.get("/", (req, res) => {
  res.status(200).end("Welcome to qrbites. Have a great day");
});
app.use(googleAuth);
app.use(magicLinkAuth);



// startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Process started at PORT ${PORT}`);
  logger.info(`Process started at PORT ${PORT}`);
});
