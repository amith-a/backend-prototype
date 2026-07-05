import { NextFunction, Request, Response } from "express";
import z from "zod";
import AppError from "../errors/app-error";

const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          result.error.issues.map((issue) => issue.message).join(", "),
          400
        )
      );
    }

    req.body = result.data;

    next();
  };
};

export default validate;