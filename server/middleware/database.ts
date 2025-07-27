import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const requireDatabase = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database not available",
      message:
        "This feature requires database connection. Please configure MONGODB_URI environment variable.",
    });
  }
  next();
};

export const optionalDatabase = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (mongoose.connection.readyState !== 1) {
    req.body._dbUnavailable = true;
  }
  next();
};
