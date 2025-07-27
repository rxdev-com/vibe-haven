import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

interface AuthRequest extends Request {
  user?: IUser;
}

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "jugadubazar-secret", {
    expiresIn: "7d",
  });
};

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jugadubazar-secret",
    ) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const requireRole = (role: "vendor" | "supplier") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Access denied. Authentication required." });
    }

    if (req.user.role !== role) {
      return res
        .status(403)
        .json({
          error: `Access denied. ${role.charAt(0).toUpperCase() + role.slice(1)} role required.`,
        });
    }

    next();
  };
};

export { auth, requireRole, generateToken, AuthRequest };
