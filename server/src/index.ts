import "dotenv/config";
import logger from "./config/logger.js";
import "./middleware/auth/passportGoogle.js";
import express from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./queue/email/email.worker.js";


import getRestaurant from "./routes/restaurant/getRestaurant.js";
import googleAuth from "./routes/auth/googleAuth.js";
import magicLinkAuth from "./routes/auth/magicLink.js";
import verifyUser from "./routes/auth/verifyUser.js";
import createRestaurant from "./routes/restaurant/createRestaurant.js";
import menuRoutes from "./routes/menu/menu.js";
import tableRoutes from "./routes/tables/tables.js";


const app = express();

// logger init for api endpoints
app.use(pinoHttp({ logger }));

// middleware init
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());

// routes

app.get("/", (req, res) => {
  res.status(200).end("Welcome to qrbites. Have a great day");
});
app.use(googleAuth);
app.use(magicLinkAuth);
app.use(getRestaurant);
app.use(verifyUser);
app.use(createRestaurant);
app.use(menuRoutes);
app.use(tableRoutes);

// startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Process started at PORT ${PORT}`);
  logger.info(`Process started at PORT ${PORT}`);
});
