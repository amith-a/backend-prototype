import { AuthRequestUser } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user: AuthRequestUser;

      validated: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

export {};
