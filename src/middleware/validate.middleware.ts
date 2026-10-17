import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../lib/errors";

export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const issues = (err as any).issues || (err as any).errors || [];
        const details = issues.map((e: any) => ({
          field: e.path ? e.path.join(".") : "",
          message: e.message,
        }));
        return next(new ValidationError("Request validation failed", details));
      }
      next(err);
    }
  };
}
