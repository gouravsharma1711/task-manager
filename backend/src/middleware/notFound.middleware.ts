import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`,
    ),
  );
};

export default notFoundHandler;