/**
 * Mock API — used when backend is unavailable (demo/preview mode)
 * Simulates network delay for realistic feel
 */
import {
  mockUsers, mockProjects, mockTasks, mockDashboard,
} from "@/lib/mockData";
import { Project, Task } from "@/types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let projects = [...mockProjects];
let tasks = [...mockTasks];

// ── Auth ──────────────────────────────────────────────────────────────────────
export const mockAuthApi = {
  login: async (data: { email: string; password: string }) => {
    await delay();
    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) throw { response: { data: { message: "Invalid credentials" } } };
    if (data.password !== (user.role === "ADMIN" ? "admin123" : "member123"))
      throw { response: { data: { message: "Invalid credentials" } } };
    const token = `mock-jwt-${user.id}-${Date.now()}`;
    return { data: { success: true, data: { user, token } } };
  },
  register: async (data: any) => {
    await delay();
    return { data: { success: true, data: { user: mockUsers[1], token: "mock-jwt-new" } } };
  },
  me: async () => {
    await delay(200);
    return { data: { success: true, data: mockUsers[0] } };
  },
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const mockUsersApi = {
  getAll: async () => { await delay(); return { data: { success: true, data: mockUsers } }; },
  getById: async (id: string) => { await delay(200); return { data: { success: true, data: mockUsers.find((u) => u.id === id) } }; },
  update: async (id: string, data: any) => {
    await delay();
    const user = { ...mockUsers.find((u) => u.id === id)!, ...data };
    return { data: { success: true, data: user } };
  },
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const mockProjectsApi = {
  getAll: async () => { await delay(); return { data: { success: true, data: projects } }; },
  create: async (data: any) => {
    await delay();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      status: data.status || "ACTIVE",
      deadline: data.deadline,
      ownerId: "user-1",
      createdAt: new Date().toISOString(),
      owner: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
      teamMembers: [],
      tasks: [],
      _count: { tasks: 0 },
    };
    projects = [newProject, ...projects];
    return { data: { success: true, data: newProject } };
  },
  update: async (id: string, data: any) => {
    await delay();
    projects = projects.map((p) => p.id === id ? { ...p, ...data } : p);
    return { data: { success: true, data: projects.find((p) => p.id === id) } };
  },
  delete: async (id: string) => {
    await delay();
    projects = projects.filter((p) => p.id !== id);
    return { data: { success: true, message: "Deleted" } };
  },
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const mockTasksApi = {
  getAll: async (params?: any) => {
    await delay();
    let filtered = [...tasks];
    if (params?.projectId) filtered = filtered.filter((t) => t.projectId === params.projectId);
    if (params?.status) filtered = filtered.filter((t) => t.status === params.status);
    if (params?.assigneeId) filtered = filtered.filter((t) => t.assigneeId === params.assigneeId);
    return { data: { success: true, data: filtered } };
  },
  create: async (data: any) => {
    await delay();
    const assignee = mockUsers.find((u) => u.id === data.assigneeId);
    const project = projects.find((p) => p.id === data.projectId);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      priority: data.priority || "MEDIUM",
      status: data.status || "TODO",
      dueDate: data.dueDate,
      assigneeId: data.assigneeId,
      projectId: data.projectId,
      createdAt: new Date().toISOString(),
      assignee: assignee ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar } : undefined,
      project: project ? { id: project.id, title: project.title } : undefined,
    };
    tasks = [newTask, ...tasks];
    return { data: { success: true, data: newTask } };
  },
  update: async (id: string, data: any) => {
    await delay();
    tasks = tasks.map((t) => t.id === id ? { ...t, ...data } : t);
    return { data: { success: true, data: tasks.find((t) => t.id === id) } };
  },
  delete: async (id: string) => {
    await delay();
    tasks = tasks.filter((t) => t.id !== id);
    return { data: { success: true, message: "Deleted" } };
  },
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const mockAnalyticsApi = {
  dashboard: async () => {
    await delay(600);
    return { data: { success: true, data: mockDashboard } };
  },
};
