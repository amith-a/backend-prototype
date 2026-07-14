import pinoHttp from "pino-http";
import logger from "../config/logger";

const requestLogger = pinoHttp({
  logger,

  autoLogging: {
    ignore: (req) => req.url === "/api/v1/health",
  },
});

export default requestLogger;
