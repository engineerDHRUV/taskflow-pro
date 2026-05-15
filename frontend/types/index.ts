export type Role = "ADMIN" | "MEMBER";
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  skills: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  ownerId: string;
  createdAt: string;
  owner: { id: string; name: string; avatar?: string };
  teamMembers: { id: string; user: { id: string; name: string; avatar?: string } }[];
  tasks?: Task[];
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
  createdAt: string;
  assignee?: { id: string; name: string; avatar?: string };
  project?: { id: string; title: string };
}

export interface Activity {
  id: string;
  action: string;
  userId: string;
  createdAt: string;
  user: { name: string; avatar?: string };
}

export interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  teamMembers: number;
  recentActivities: Activity[];
  tasksByStatus: { status: TaskStatus; _count: { status: number } }[];
  tasksByPriority: { priority: Priority; _count: { priority: number } }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
