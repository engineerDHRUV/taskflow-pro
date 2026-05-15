import axios from "axios";
import {
  mockAuthApi, mockUsersApi, mockProjectsApi, mockTasksApi, mockAnalyticsApi,
} from "./mockApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Demo mode detection ───────────────────────────────────────────────────────
// Set NEXT_PUBLIC_DEMO_MODE=true in .env.local to force mock mode
// OR if backend is unreachable, mock mode activates automatically
export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  typeof window !== "undefined" && localStorage.getItem("taskflow_demo") === "true";

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("taskflow_token");
    if (token && !token.startsWith("mock-")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const token = localStorage.getItem("taskflow_token");
      if (!token?.startsWith("mock-")) {
        localStorage.removeItem("taskflow_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// ── Smart API wrapper — tries real API, falls back to mock ────────────────────
function withFallback(realFn: () => Promise<any>, mockFn: () => Promise<any>): Promise<any> {
  if (DEMO_MODE) return mockFn();
  // Check if token is a mock token
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("taskflow_token");
    if (token?.startsWith("mock-")) return mockFn();
  }
  return realFn().catch(() => mockFn());
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    withFallback(
      () => api.post("/auth/login", data),
      () => mockAuthApi.login(data)
    ),
  register: (data: any) =>
    withFallback(
      () => api.post("/auth/register", data),
      () => mockAuthApi.register(data)
    ),
  me: () =>
    withFallback(
      () => api.get("/auth/me"),
      () => mockAuthApi.me()
    ),
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () =>
    withFallback(() => api.get("/users"), () => mockUsersApi.getAll()),
  getById: (id: string) =>
    withFallback(() => api.get(`/users/${id}`), () => mockUsersApi.getById(id)),
  update: (id: string, data: any) =>
    withFallback(() => api.put(`/users/${id}`, data), () => mockUsersApi.update(id, data)),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: () =>
    withFallback(() => api.get("/projects"), () => mockProjectsApi.getAll()),
  create: (data: any) =>
    withFallback(() => api.post("/projects", data), () => mockProjectsApi.create(data)),
  update: (id: string, data: any) =>
    withFallback(() => api.put(`/projects/${id}`, data), () => mockProjectsApi.update(id, data)),
  delete: (id: string) =>
    withFallback(() => api.delete(`/projects/${id}`), () => mockProjectsApi.delete(id)),
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasksApi = {
  getAll: (params?: any) =>
    withFallback(() => api.get("/tasks", { params }), () => mockTasksApi.getAll(params)),
  create: (data: any) =>
    withFallback(() => api.post("/tasks", data), () => mockTasksApi.create(data)),
  update: (id: string, data: any) =>
    withFallback(() => api.put(`/tasks/${id}`, data), () => mockTasksApi.update(id, data)),
  delete: (id: string) =>
    withFallback(() => api.delete(`/tasks/${id}`), () => mockTasksApi.delete(id)),
};

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () =>
    withFallback(() => api.get("/analytics/dashboard"), () => mockAnalyticsApi.dashboard()),
};

export default api;
