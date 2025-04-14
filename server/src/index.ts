import 'dotenv/config';
import express from "express";
import logger from './config/logger';
import { pinoHttp } from 'pino-http';

const app = express();

app.use(pinoHttp({logger}));

app.get("/", (req, res) => {
  res.status(200).end("Welcome to qrbites. Have a great day");
});

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => {
  logger.info(`Process started at PORT ${PORT}`);
});