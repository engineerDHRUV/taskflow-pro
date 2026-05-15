import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@taskflow.pro" },
    update: {},
    create: {
      name: "Dhruv Admin",
      email: "admin@taskflow.pro",
      password: adminPassword,
      role: "ADMIN",
      bio: "Full-stack developer & AI/ML enthusiast from Faridabad, Haryana",
      skills: ["Python", "TypeScript", "React", "Node.js", "Machine Learning", "AI Integration"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  // Create member user
  const memberPassword = await bcrypt.hash("member123", 12);
  const member = await prisma.user.upsert({
    where: { email: "member@taskflow.pro" },
    update: {},
    create: {
      name: "Alex Member",
      email: "member@taskflow.pro",
      password: memberPassword,
      role: "MEMBER",
      bio: "Frontend developer passionate about UI/UX",
      skills: ["React", "TypeScript", "Tailwind CSS", "Figma"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member",
    },
  });

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: "sample-project-1" },
    update: {},
    create: {
      id: "sample-project-1",
      title: "TaskFlow Pro Development",
      description: "Building the next-gen task management platform",
      status: "ACTIVE",
      deadline: new Date("2026-12-31"),
      ownerId: admin.id,
      teamMembers: { create: [{ userId: member.id }] },
    },
  });

  // Create sample tasks
  const tasks = [
    { title: "Design System Setup", status: "COMPLETED" as const, priority: "HIGH" as const },
    { title: "Authentication Module", status: "COMPLETED" as const, priority: "URGENT" as const },
    { title: "Dashboard Analytics", status: "IN_PROGRESS" as const, priority: "HIGH" as const },
    { title: "Kanban Board", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const },
    { title: "Team Management", status: "REVIEW" as const, priority: "MEDIUM" as const },
    { title: "Portfolio Page", status: "TODO" as const, priority: "LOW" as const },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: { ...t, projectId: project.id, assigneeId: member.id, dueDate: new Date("2026-12-31") },
    });
  }

  // Create activities
  await prisma.activity.createMany({
    data: [
      { action: "Admin created TaskFlow Pro project", userId: admin.id },
      { action: "Alex joined the team", userId: member.id },
      { action: "Completed Design System Setup", userId: admin.id },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("Admin: admin@taskflow.pro / admin123");
  console.log("Member: member@taskflow.pro / member123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
