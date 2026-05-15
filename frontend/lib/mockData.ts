import { User, Project, Task, DashboardData, Activity } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Dhruv Admin",
    email: "admin@taskflow.pro",
    role: "ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    bio: "Full-stack developer & AI/ML enthusiast from Faridabad, Haryana",
    skills: ["Python", "TypeScript", "React", "Node.js", "Machine Learning", "AI Integration"],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    name: "Alex Member",
    email: "member@taskflow.pro",
    role: "MEMBER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member",
    bio: "Frontend developer passionate about UI/UX and creative design",
    skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "Framer Motion"],
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "user-3",
    name: "Priya Sharma",
    email: "priya@taskflow.pro",
    role: "MEMBER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    bio: "Backend engineer specializing in distributed systems",
    skills: ["Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "user-4",
    name: "Rahul Dev",
    email: "rahul@taskflow.pro",
    role: "MEMBER",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    bio: "ML engineer working on NLP and computer vision projects",
    skills: ["Python", "TensorFlow", "OpenCV", "NLP", "FAISS"],
    createdAt: "2026-02-10T00:00:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "TaskFlow Pro Development",
    description: "Building the next-gen task management platform with AI features",
    status: "ACTIVE",
    deadline: "2026-12-31T00:00:00Z",
    ownerId: "user-1",
    createdAt: "2026-01-01T00:00:00Z",
    owner: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
    teamMembers: [
      { id: "tm-1", user: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" } },
      { id: "tm-2", user: { id: "user-3", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" } },
    ],
    tasks: [
      { id: "t1", title: "", description: "", priority: "HIGH", status: "COMPLETED", projectId: "proj-1", createdAt: "" },
      { id: "t2", title: "", description: "", priority: "HIGH", status: "COMPLETED", projectId: "proj-1", createdAt: "" },
      { id: "t3", title: "", description: "", priority: "MEDIUM", status: "IN_PROGRESS", projectId: "proj-1", createdAt: "" },
      { id: "t4", title: "", description: "", priority: "MEDIUM", status: "TODO", projectId: "proj-1", createdAt: "" },
    ],
    _count: { tasks: 4 },
  },
  {
    id: "proj-2",
    title: "AI Face Recognition System",
    description: "Real-time facial recognition attendance system using CNNs and OpenCV",
    status: "COMPLETED",
    deadline: "2026-06-30T00:00:00Z",
    ownerId: "user-1",
    createdAt: "2026-01-10T00:00:00Z",
    owner: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
    teamMembers: [
      { id: "tm-3", user: { id: "user-4", name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" } },
    ],
    tasks: [
      { id: "t5", title: "", description: "", priority: "HIGH", status: "COMPLETED", projectId: "proj-2", createdAt: "" },
      { id: "t6", title: "", description: "", priority: "HIGH", status: "COMPLETED", projectId: "proj-2", createdAt: "" },
      { id: "t7", title: "", description: "", priority: "MEDIUM", status: "COMPLETED", projectId: "proj-2", createdAt: "" },
    ],
    _count: { tasks: 3 },
  },
  {
    id: "proj-3",
    title: "Deepfake Detection Pipeline",
    description: "Deep learning pipeline to detect manipulated media using transformers",
    status: "ON_HOLD",
    deadline: "2026-09-30T00:00:00Z",
    ownerId: "user-1",
    createdAt: "2026-02-01T00:00:00Z",
    owner: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
    teamMembers: [
      { id: "tm-4", user: { id: "user-3", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" } },
      { id: "tm-5", user: { id: "user-4", name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" } },
    ],
    tasks: [
      { id: "t8", title: "", description: "", priority: "URGENT", status: "IN_PROGRESS", projectId: "proj-3", createdAt: "" },
      { id: "t9", title: "", description: "", priority: "HIGH", status: "TODO", projectId: "proj-3", createdAt: "" },
    ],
    _count: { tasks: 2 },
  },
  {
    id: "proj-4",
    title: "Business Admin Dashboard",
    description: "AI-integrated business website with admin dashboard and token tracking",
    status: "ACTIVE",
    deadline: "2026-08-15T00:00:00Z",
    ownerId: "user-1",
    createdAt: "2026-02-15T00:00:00Z",
    owner: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
    teamMembers: [
      { id: "tm-6", user: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" } },
    ],
    tasks: [
      { id: "t10", title: "", description: "", priority: "HIGH", status: "REVIEW", projectId: "proj-4", createdAt: "" },
      { id: "t11", title: "", description: "", priority: "MEDIUM", status: "IN_PROGRESS", projectId: "proj-4", createdAt: "" },
      { id: "t12", title: "", description: "", priority: "LOW", status: "TODO", projectId: "proj-4", createdAt: "" },
    ],
    _count: { tasks: 3 },
  },
];

export const mockTasks: Task[] = [
  { id: "task-1", title: "Design System & Component Library", description: "Set up Tailwind config, color tokens, and base components", priority: "HIGH", status: "COMPLETED", dueDate: "2026-05-01T00:00:00Z", assigneeId: "user-2", projectId: "proj-1", createdAt: "2026-01-05T00:00:00Z", assignee: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-2", title: "JWT Authentication Module", description: "Implement login, register, and token refresh", priority: "URGENT", status: "COMPLETED", dueDate: "2026-05-05T00:00:00Z", assigneeId: "user-1", projectId: "proj-1", createdAt: "2026-01-06T00:00:00Z", assignee: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-3", title: "Dashboard Analytics Charts", description: "Integrate Recharts with real API data", priority: "HIGH", status: "IN_PROGRESS", dueDate: "2026-06-15T00:00:00Z", assigneeId: "user-1", projectId: "proj-1", createdAt: "2026-01-10T00:00:00Z", assignee: { id: "user-1", name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-4", title: "Kanban Drag & Drop Board", description: "Implement drag-and-drop with smooth animations", priority: "MEDIUM", status: "IN_PROGRESS", dueDate: "2026-06-20T00:00:00Z", assigneeId: "user-2", projectId: "proj-1", createdAt: "2026-01-12T00:00:00Z", assignee: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-5", title: "Team Management Page", description: "3D tilt cards with member stats and skills", priority: "MEDIUM", status: "REVIEW", dueDate: "2026-06-25T00:00:00Z", assigneeId: "user-3", projectId: "proj-1", createdAt: "2026-01-15T00:00:00Z", assignee: { id: "user-3", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-6", title: "Portfolio Page Animation", description: "Cinematic scroll animations and typing effects", priority: "LOW", status: "TODO", dueDate: "2026-07-01T00:00:00Z", assigneeId: "user-2", projectId: "proj-1", createdAt: "2026-01-20T00:00:00Z", assignee: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" }, project: { id: "proj-1", title: "TaskFlow Pro Development" } },
  { id: "task-7", title: "Train Face Recognition Model", description: "CNN model training with custom dataset", priority: "URGENT", status: "COMPLETED", dueDate: "2026-04-01T00:00:00Z", assigneeId: "user-4", projectId: "proj-2", createdAt: "2026-01-08T00:00:00Z", assignee: { id: "user-4", name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" }, project: { id: "proj-2", title: "AI Face Recognition System" } },
  { id: "task-8", title: "Real-time Video Processing", description: "OpenCV integration for live camera feed", priority: "HIGH", status: "COMPLETED", dueDate: "2026-04-15T00:00:00Z", assigneeId: "user-4", projectId: "proj-2", createdAt: "2026-01-09T00:00:00Z", assignee: { id: "user-4", name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" }, project: { id: "proj-2", title: "AI Face Recognition System" } },
  { id: "task-9", title: "Deepfake Spatial Analysis", description: "Analyze facial artifacts using transformer models", priority: "URGENT", status: "IN_PROGRESS", dueDate: "2026-08-01T00:00:00Z", assigneeId: "user-4", projectId: "proj-3", createdAt: "2026-02-05T00:00:00Z", assignee: { id: "user-4", name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" }, project: { id: "proj-3", title: "Deepfake Detection Pipeline" } },
  { id: "task-10", title: "Admin Dashboard UI", description: "Build responsive admin panel with charts", priority: "HIGH", status: "REVIEW", dueDate: "2026-07-15T00:00:00Z", assigneeId: "user-2", projectId: "proj-4", createdAt: "2026-02-20T00:00:00Z", assignee: { id: "user-2", name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" }, project: { id: "proj-4", title: "Business Admin Dashboard" } },
];

export const mockActivities: Activity[] = [
  { id: "a1", action: "Dhruv Admin created TaskFlow Pro project", userId: "user-1", createdAt: "2026-05-14T10:00:00Z", user: { name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" } },
  { id: "a2", action: "Alex Member completed Design System task", userId: "user-2", createdAt: "2026-05-14T09:30:00Z", user: { name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" } },
  { id: "a3", action: "Priya Sharma joined the team", userId: "user-3", createdAt: "2026-05-14T09:00:00Z", user: { name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" } },
  { id: "a4", action: "Rahul Dev updated Deepfake Detection task", userId: "user-4", createdAt: "2026-05-14T08:30:00Z", user: { name: "Rahul Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" } },
  { id: "a5", action: "Dhruv Admin created AI Face Recognition project", userId: "user-1", createdAt: "2026-05-13T17:00:00Z", user: { name: "Dhruv Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" } },
  { id: "a6", action: "Alex Member moved task to In Progress", userId: "user-2", createdAt: "2026-05-13T16:00:00Z", user: { name: "Alex Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=member" } },
];

export const mockDashboard: DashboardData = {
  totalProjects: 4,
  totalTasks: 10,
  completedTasks: 4,
  pendingTasks: 6,
  overdueTasks: 1,
  teamMembers: 4,
  recentActivities: mockActivities,
  tasksByStatus: [
    { status: "TODO", _count: { status: 2 } },
    { status: "IN_PROGRESS", _count: { status: 3 } },
    { status: "REVIEW", _count: { status: 2 } },
    { status: "COMPLETED", _count: { status: 4 } },
  ],
  tasksByPriority: [
    { priority: "LOW", _count: { priority: 1 } },
    { priority: "MEDIUM", _count: { priority: 3 } },
    { priority: "HIGH", _count: { priority: 4 } },
    { priority: "URGENT", _count: { priority: 3 } },
  ],
};
