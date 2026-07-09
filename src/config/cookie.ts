import env from "./env";
import { CookieOptions } from "express";

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1/auth/refresh",
  maxAge: env.REFRESH_SESSION_DAYS * 24 * 60 * 60 * 1000,
};