export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export type Role = "ADMIN" | "MEMBER";
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
