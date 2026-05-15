import { Response } from "express";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]).optional(),
  deadline: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "ACTIVE",
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        ownerId: req.user!.userId,
        teamMembers: data.memberIds ? {
          create: data.memberIds.map((uid) => ({ userId: uid }))
        } : undefined,
      },
      include: { owner: { select: { id: true, name: true, avatar: true } }, teamMembers: { include: { user: { select: { id: true, name: true, avatar: true } } } }, _count: { select: { tasks: true } } },
    });
    await prisma.activity.create({ data: { action: `Created project "${project.title}"`, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: project });
  } catch (err: any) {
    if (err.name === "ZodError") { res.status(400).json({ success: false, errors: err.errors }); return; }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const where = req.user?.role === "ADMIN" ? {} : {
      OR: [{ ownerId: req.user!.userId }, { teamMembers: { some: { userId: req.user!.userId } } }]
    };
    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, avatar: true } },
        teamMembers: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: projects });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({ where: { id: (req.params.id as string) } });
    if (!project) { res.status(404).json({ success: false, message: "Project not found" }); return; }
    if (project.ownerId !== req.user!.userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden" }); return;
    }
    const data = projectSchema.partial().parse(req.body);
    const updated = await prisma.project.update({
      where: { id: (req.params.id as string) },
      data: { ...data, deadline: data.deadline ? new Date(data.deadline) : undefined },
      include: { owner: { select: { id: true, name: true, avatar: true } }, teamMembers: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({ where: { id: (req.params.id as string) } });
    if (!project) { res.status(404).json({ success: false, message: "Project not found" }); return; }
    if (project.ownerId !== req.user!.userId && req.user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Forbidden" }); return;
    }
    await prisma.project.delete({ where: { id: (req.params.id as string) } });
    await prisma.activity.create({ data: { action: `Deleted project "${project.title}"`, userId: req.user!.userId } });
    res.json({ success: true, message: "Project deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};