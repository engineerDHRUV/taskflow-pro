import { create } from "zustand";
import { Project, Task, User, DashboardData } from "@/types";

interface AppState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  dashboard: DashboardData | null;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  setUsers: (users: User[]) => void;
  setDashboard: (data: DashboardData) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: [],
  tasks: [],
  users: [],
  dashboard: null,
  sidebarOpen: true,
  commandPaletteOpen: false,
  setProjects: (projects) => set({ projects }),
  setTasks: (tasks) => set({ tasks }),
  setUsers: (users) => set({ users }),
  setDashboard: (dashboard) => set({ dashboard }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, data) =>
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
  removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (id, data) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
}));
