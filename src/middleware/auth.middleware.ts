import { NextFunction, Request, Response } from "express";
import AppError from "../errors/app-error";
import jwtService from "../services/jwt.service";

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split("Bearer ")[1];

    if (!authToken) {
      return next(new AppError("Unauthorized", 401));
    }

    const payload = jwtService.verifyAccessToken(authToken);

    req.user = {
      id: payload.sub,
      roleId: payload.roleId,
    };

    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
};
export default authenticate;
