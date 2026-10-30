import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import env from "../config/config.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  let statusCode = 500;
  let message = "Internal Server Error";

  // Custom API errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Invalid MongoDB ObjectId or Mongoose cast error
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID or data format";
  }

  // Mongoose validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = err.message;
  }

  // MongoDB duplicate key error
  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    statusCode = 409;
    message = "Duplicate value already exists";
  }

  // Invalid JSON sent to Express
  else if (
    err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400
  ) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  // Return JSON for every handled error
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(env.NODE_ENV === "development" && err instanceof Error
      ? { stack: err.stack }
      : {}),
  });
};

export default errorHandler;