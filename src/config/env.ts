import dotenv from "dotenv";
import { z } from "zod";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({
  path: envFile,
});

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
  JWT_ACCESS_SECRET: z.string().min(18),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(18),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  REFRESH_SESSION_DAYS: z.coerce.number().int().positive().default(7),
});

const env = envSchema.parse(process.env);

export default env;
