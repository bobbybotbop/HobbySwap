import { Request, Response } from "express";
import User from "../models/userModel.js"; // make sure your model is TS compatible
import bcrypt from "bcrypt";

// GET all users EXECEPT for encrypted password
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select("-encryptedPassword");
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET user
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Validate user credientials
export const verifyPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { netid, password } = req.body; // client provides netid + password

    const user = await User.findOne({ netid });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.encryptedPassword); // compare input with hashed password
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE password of user
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword} = req.body;

    if (!newPassword) {
      res.status(404).json({ message: "New Password is required" });
      return;
    }

    const hashedPassword = bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).select("-encryptedPassword");

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
