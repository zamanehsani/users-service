// const jwt = require("jsonwebtoken");

/**
 * This middleware has been outdated and is replaced by the simple-jwt-auth-middleware package.
 */
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
export const authenticate = (req: Request, res: Response, next: Next): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
    // return next(new Error("Unauthorized: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach the user payload (id, role) to the request
    console.log("req.user is added to the re.user ");
    next();
  } catch (err) {
    // next(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check user roles for protected routes
export const authorize = (req: Request, res: Response, next: Next): void => {
  console.log("req user roles: ", req.user.roles);

  if (
    !req.user ||
    !Array.isArray(req.user.roles) ||
    !req.user.roles.includes("admin")
  ) {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  console.log("Authorized");
  next();
};
