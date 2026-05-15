import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "MEMBER"]).optional().default("MEMBER"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(400).json({ success: false, message: "Email already registered" });
      return;
    }
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: data.role },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    await prisma.activity.create({ data: { action: `${user.name} joined TaskFlow`, userId: user.id } });
    res.status(201).json({ success: true, message: "Registration successful", data: { user, token } });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
      return;
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    const { password: _, ...userWithoutPassword } = user;
    await prisma.activity.create({ data: { action: `${user.name} logged in`, userId: user.id } });
    res.json({ success: true, message: "Login successful", data: { user: userWithoutPassword, token } });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
      return;
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, skills: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
