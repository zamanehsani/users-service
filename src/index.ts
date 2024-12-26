// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { router } from "./routes/index";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("User service running");
});

app.use("/users", router);

// connect to postgres
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log("Connected to postgres");
});

app.listen(port, () => {
  console.log(`Users service running on port ${port}`);
});
