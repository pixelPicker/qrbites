import 'dotenv/config';
import logger from './config/logger';
import express from "express";
import cors from "cors";
import { pinoHttp } from 'pino-http';
import "../src/config/supertokens.js";


const app = express();


// logger init for api endpoints
app.use(pinoHttp({logger}));

// cors init
app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["content-type"],
  credentials: true,
}))


app.get("/", (req, res) => {
  res.status(200).end("Welcome to qrbites. Have a great day");
});

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => {
  logger.info(`Process started at PORT ${PORT}`);
});