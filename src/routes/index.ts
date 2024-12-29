import express from "express";
import {
  addUser,
  updateUser,
  removeUser,
  getUserBySearch,
  getUserById,
} from "../controllers";

import { authenticate, authorize } from "../middlewares/index";

export const router = express.Router();

router.post("/", authenticate, authorize, addUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);
router.get("/search", getUserBySearch);
router.get("/:id", getUserById);

// add the login and logout routes
// router.post("/login", login);
