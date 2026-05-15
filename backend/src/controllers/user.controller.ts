import { Response } from "express";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, skills: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req.params.id as string) },
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, skills: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ success: false, message: "User not found" }); return; }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.userId !== (req.params.id as string) && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden" }); return;
    }
    const data = updateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: (req.params.id as string) },
      data,
      select: { id: true, name: true, email: true, role: true, avatar: true, bio: true, skills: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};