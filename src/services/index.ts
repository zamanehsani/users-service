import { PrismaClient } from "@prisma/client";
import rabbitmq from "../utils/rabbitmt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const addUser = async (data: any) => {
  try {
    // if data is not provided or not in the right format, send proper error message to the front
    if (!data || Object.keys(data).length === 0) {
      throw new Error("Please provide user data");
    }

    const user = await prisma.users.create({ data });
    await rabbitmq.publish("users", "user.created", user);
    console.log("user created successfully and published to RabbitMQ");
    return user;
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Error adding user");
  }
};

export const updateUser = async (id: string, data: any) => {
  /**
   * add proper validation of id and data not being present.
   * or date and or time is not the right format.
   * or id is not found
   * then send proper error message to the front
   *
   */
  try {
    const user = await prisma.users.update({
      where: { id },
      data,
    });
    await rabbitmq.publish("users", "user.updated", user);
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

export const removeUser = async (id: string) => {
  // add the proper validate. if the id is not provided, or the id is not valide or not found in the
  // DB then send proper error message to the front.
  try {
    const user = await prisma.users.delete({
      where: { id },
    });
    await rabbitmq.publish("users", "user.deleted", user);
    return user;
  } catch (error) {
    console.error("Error removing user:", error);
    throw new Error("Error removing user");
  }
};

export const getUserById = async (id: string) => {
  /**
   * as the same, valide the request
   */
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

export const getUserBySearch = async (query: any) => {
  try {
    const { firstName, lastName, email, phoneNumber, department, designation } =
      query;

    const whereClause: any = {};

    if (!query || Object.keys(query).length === 0) {
      throw new Error("Please provide at least one search parameter.");
    }

    if (firstName) {
      whereClause.firstName = {
        contains: firstName as string,
        mode: "insensitive",
      };
    }
    if (lastName) {
      whereClause.lastName = {
        contains: lastName as string,
        mode: "insensitive",
      };
    }
    if (email) {
      whereClause.email = {
        contains: email as string,
        mode: "insensitive",
      };
    }
    if (phoneNumber) {
      whereClause.phoneNumber = {
        contains: phoneNumber as string,
        mode: "insensitive",
      };
    }

    if (department) {
      whereClause.department = {
        contains: department as string,
        mode: "insensitive",
      };
    }
    if (designation) {
      whereClause.designation = {
        contains: designation as string,
        mode: "insensitive",
      };
    }

    const users = await prisma.users.findMany({
      where: whereClause,
    });

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  } catch (error: any) {
    console.error("Error searching users:", error);
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    if (!email) {
      throw new Error("Please provide both email");
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const token = generateToken(user);

    return { user, token };
  } catch (error) {
    throw new Error("Error logging in user");
  }
};

// Implement token generation logic (e.g., JWT)
const generateToken = (user: any) => {
  const payload = user;
  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
};
