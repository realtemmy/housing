import { Request, Response, NextFunction } from "express";

/**
 * Higher-order function to handle async route handlers
 * Wraps async functions and passes errors to Express error handler
 */
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;