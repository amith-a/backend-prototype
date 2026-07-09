import { NextFunction, Request, Response } from "express";
import AppError from "../errors/app-error";

const authorize = (allowedRoles: number[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!allowedRoles.includes(req.user.roleId)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};

export default authorize;