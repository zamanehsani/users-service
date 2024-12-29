import express from "express";
import {
  addUser,
  login,
  updateUser,
  removeUser,
  getUserBySearch,
  getUserById,
} from "../controllers";

import { authenticate, authorize } from "../middlewares/index";

export const router = express.Router();

router.post("/", authenticate, authorize, addUser);
router.patch("/:id", authenticate, authorize, updateUser);
router.delete("/:id", authenticate, authorize, removeUser);
router.get("/search", authenticate, authorize, getUserBySearch);
router.get("/:id", authenticate, authorize, getUserById);
router.post("/login", login);
