import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError from "../errors/app-error";

const validate = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new AppError(
          result.error.issues.map((issue) => issue.message).join(", "),
          400,
        ),
      );
    }

    next();
  };
};

export default validate;
