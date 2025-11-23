const db = require("../config/db");

import { Request, Response } from "express";

/**
 * Retrieves all users from the database and sends them in the response.
 *
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const data = await db.query("SELECT * FROM user");

    if (!data || !data[0] || data[0].length === 0) {
      return res.json({ success: false, message: "No users found" });
    }
    return res.json({
      success: true,
      data: data[0],
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.json({ success: false, message: "Internal Error" });
  }
};

/**
 * Retrieves a user by their ID from the database.
 *
 */
const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.user_id;
  try {
    const data = await db.query("SELECT * FROM user WHERE user_id = ?", [
      userId,
    ]);
    if (data[0].length === 0) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User found", data: data[0] });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/**
 * Retrieves a user by their username from the database.
 */
const getUserByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;
  try {
    const data = await db.query("SELECT * FROM user WHERE username = ?", [
      username,
    ]);
    if (data[0].length === 0) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User found", data: data[0][0] });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/**
 * Creates a new user in the database.
 *
 */
const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    if (!firstName || !lastName || !email || !username || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const data = await db.query(
      "INSERT INTO user (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, username, password]
    );
    if (!data || data[0].affectedRows === 0) {
      return res.json({ success: false, message: "Failed to create user" });
    }
    return res.json({
      success: true,
      message: "User created successfully",
      data: {
        userId: data[0].user_id,
        firstName,
        lastName,
        email,
        username,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

/**
 * Updates a user's information in the database.
 *
 */
const updateUser = async (req: Request, res: Response) => {
  const user_id = req.params.user_id;
  const { firstName, lastName, email, username, password } = req.body;

  if (!firstName || !lastName || !email || !username || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const data = await db.query(
      "UPDATE user SET firstName = ?, lastName = ?, email = ?, username = ?, password = ? WHERE user_id = ?",
      [firstName, lastName, email, username, password, user_id]
    );

    if (data[0].affectedRows === 0) {
      return res.json({
        success: false,
        message: "User not found or no changes made",
      });
    }
    return res.json({
      success: true,
      message: "User updated successfully",
      data: {
        user_id,
        firstName,
        lastName,
        email,
        username,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export { getUsers, getUserById, getUserByUsername, createUser, updateUser };
