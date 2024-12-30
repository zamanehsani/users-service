import express from "express";
import {
  addUser,
  login,
  updateUser,
  removeUser,
  getUserBySearch,
  getUserById,
} from "../controllers";
import { authenticate, authorizeRoles } from "simple-jwt-auth-middleware";

export const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/", authenticate(SECRET), authorizeRoles("admin"), addUser);
router.patch("/:id", authenticate(SECRET), updateUser);
router.delete(
  "/:id",
  authenticate(SECRET),
  authorizeRoles("admin"),
  removeUser
);
router.get(
  "/search",
  authenticate(SECRET),
  authorizeRoles("admin"),
  getUserBySearch
);
router.get("/:id", authenticate(SECRET), authorizeRoles("admin"), getUserById);
router.post("/login", login);
