import express from "express";
import {
  addUser,
  updateUser,
  removeUser,
  getUserBySearch,
  getUserById,
} from "../controllers";

export const router = express.Router();

router.post("/", addUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);
router.get("/search", getUserBySearch);
router.get("/:id", getUserById);
