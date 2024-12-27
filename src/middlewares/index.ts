// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction as Next } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify token and attach user info to the request
export const authenticate = (req: Request, res: Response, next: Next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new Error("Unauthorized: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("decoded: ", decoded);
    req.user = decoded; // Attach the user payload (id, role) to the request
    next();
  } catch (err) {
    next(err);
    // return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check user roles for protected routes
export const authorize = (req: Request, res: Response, next: Next) => {
  console.log("req.user: ", req.user);
  if (!req.user.includes(req.user.role)) {
    return next(new Error("Unauthorized: Access denied"));
    //   return res.status(403).json({ message: "Access denied" });
  }
  next();
};
