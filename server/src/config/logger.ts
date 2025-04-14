import pino from "pino";

const transport = pino.transport({
  target: "pino/file",
  options: { destination: process.env.LOG_FILE_PATH, mkdir: true },
});

const logger = pino(transport);

export default logger;
