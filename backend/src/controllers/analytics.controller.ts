import { Response } from "express";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth";

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === "ADMIN";
    const userId = req.user!.userId;

    const projectWhere = isAdmin ? {} : { OR: [{ ownerId: userId }, { teamMembers: { some: { userId } } }] };
    const taskWhere = isAdmin ? {} : { OR: [{ assigneeId: userId }, { project: { OR: [{ ownerId: userId }, { teamMembers: { some: { userId } } }] } }] };

    const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, teamMembers, recentActivities] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: "COMPLETED" } }),
      prisma.task.count({ where: { ...taskWhere, status: { in: ["TODO", "IN_PROGRESS", "REVIEW"] } } }),
      prisma.task.count({ where: { ...taskWhere, status: { not: "COMPLETED" }, dueDate: { lt: new Date() } } }),
      prisma.user.count(),
      prisma.activity.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, avatar: true } } } }),
    ]);

    const tasksByStatus = await prisma.task.groupBy({
      by: ["status"],
      where: taskWhere,
      _count: { status: true },
    });

    const tasksByPriority = await prisma.task.groupBy({
      by: ["priority"],
      where: taskWhere,
      _count: { priority: true },
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        teamMembers,
        recentActivities,
        tasksByStatus,
        tasksByPriority,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
