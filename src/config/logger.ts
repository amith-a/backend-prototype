import pino from "pino";
import env from "./env";

const logger = pino({
  level:
    env.NODE_ENV === "test" && process.env.DEBUG_TESTS !== "true"
      ? "silent"
      : env.LOG_LEVEL,

  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export default logger;
