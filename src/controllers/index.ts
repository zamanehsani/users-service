import { Request, Response } from "express";
import {
  addUser as addUserService,
  loginUser as loginUserService,
  updateUser as updateUserService,
  removeUser as removeUserService,
  getUserBySearch as getUserBySearchService,
  getUserById as getUserByIdService,
} from "../services";

export const login = async (req: Request, res: Response) => {
  try {
    // check if he can login
    const u = await loginUserService(req.body.email, req.body.password);
    res.status(200).json(u);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    // check if he can add user
    const user = await addUserService(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await updateUserService(id, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await removeUserService(id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBySearch = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await getUserBySearchService(req.query);
    if (!users || users.length === 0) {
      console.log("No user found");
      return res.status(404).json({ message: "No user found" });
    }
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
