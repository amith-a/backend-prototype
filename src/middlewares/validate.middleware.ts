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

    const data = result.data as Record<string, unknown>;

    if (data.body !== undefined) {
      req.body = data.body;
    }
    if (data.query !== undefined) {
      req.query = data.query as typeof req.query;
    }
    if (data.params !== undefined) {
      req.params = data.params as typeof req.params;
    }

    next();
  };
};

export default validate;
