import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

export const canAddUser = async (req: Request): Promise<boolean> => {
  const prisma = new PrismaClient();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  console.log("token: ", token);
  // Decode JWT payload (assuming it's a simple base64 encoded JSON)
  const payload = jwt.decode(token);
  if (!payload) {
    throw new Error("Invalid token");
  }
  console.log("paylod: ", payload);

  // Check with with CS service if the firm has remainging user slots
  const response = await axios.get("http://localhost:3003/support/{firm-id}");
  console.log("response: ", response.data);

  // check with the users of the firm  and compare the number of users with the number of slots
  // get the total number of from DB
  const users = await prisma.users.count();
  console.log("users in DB: ", users);

  return response.data;
};
