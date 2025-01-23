import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
// Test whether its validate request body ..
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
      return;
    }
    next();
  };
};
