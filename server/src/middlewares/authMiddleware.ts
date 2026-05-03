import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token không tồn tại" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
