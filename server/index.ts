import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import materialRoutes from "./routes/materials.js";
import orderRoutes from "./routes/orders.js";
import { requireDatabase } from "./middleware/database.js";
import { handleDemo } from "./routes/demo.js";

export function createServer() {
  const app = express();

  // Connect to MongoDB (non-blocking)
  connectDB().catch(console.error);

  // Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:8080",
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "JugaduBazar API is running!";
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
      message: ping,
      timestamp: new Date().toISOString(),
      status: "healthy",
      database: dbStatus,
      features: {
        authentication: dbStatus === "connected",
        materials: dbStatus === "connected",
        orders: dbStatus === "connected",
      },
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes); // Auth works without database (mock mode)
  app.use("/api/materials", materialRoutes); // Materials work with mock data
  app.use("/api/orders", orderRoutes); // Orders work with mock data

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Error:", err);

      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ error: "Validation failed", details: err.message });
      }

      if (err.name === "CastError") {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      if (err.code === 11000) {
        return res.status(400).json({ error: "Duplicate entry" });
      }

      res.status(500).json({ error: "Internal server error" });
    },
  );

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  return app;
}
