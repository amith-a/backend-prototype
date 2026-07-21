// src/config/redis.ts

import Redis from "ioredis";
import env from "../config/env";
import logger from "./logger";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", (err: Error) => logger.error({ err }, "Redis error"));
