import { Response } from "express";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string(),
});

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        status: data.status || "TODO",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assigneeId: data.assigneeId || undefined,
        projectId: data.projectId,
      },
      include: { assignee: { select: { id: true, name: true, avatar: true } }, project: { select: { id: true, title: true } } },
    });
    await prisma.activity.create({ data: { action: `Created task "${task.title}"`, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    if (err.name === "ZodError") { res.status(400).json({ success: false, errors: err.errors }); return; }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const assigneeId = req.query.assigneeId as string | undefined;
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (req.user?.role !== "ADMIN") {
      where.OR = [{ assigneeId: req.user!.userId }, { project: { OR: [{ ownerId: req.user!.userId }, { teamMembers: { some: { userId: req.user!.userId } } }] } }];
    }
    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: { select: { id: true, name: true, avatar: true } }, project: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = taskSchema.partial().parse(req.body);
    const task = await prisma.task.update({
      where: { id: (req.params.id as string) },
      data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
      include: { assignee: { select: { id: true, name: true, avatar: true } }, project: { select: { id: true, title: true } } },
    });
    await prisma.activity.create({ data: { action: `Updated task "${task.title}"`, userId: req.user!.userId } });
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({ where: { id: (req.params.id as string) } });
    if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
    await prisma.task.delete({ where: { id: (req.params.id as string) } });
    res.json({ success: true, message: "Task deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};