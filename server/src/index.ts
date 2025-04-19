import 'dotenv/config';
import logger from './config/logger';
import express from "express";
import supertokens from "supertokens-node";
import { middleware } from 'supertokens-node/framework/express';
import cors from "cors";
import { pinoHttp } from 'pino-http';

const app = express();


// logger init for api endpoints
app.use(pinoHttp({logger}));

// cors init
app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
}))

// supertokens middleware init
app.use(middleware());

app.get("/", (req, res) => {
  res.status(200).end("Welcome to qrbites. Have a great day");
});

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => {
  logger.info(`Process started at PORT ${PORT}`);
});