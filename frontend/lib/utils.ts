import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getDaysUntil(date: string | Date): number {
  const now = new Date();
  const d = new Date(date);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const priorityColors: Record<string, string> = {
  LOW: "text-green-400 bg-green-400/10 border-green-400/20",
  MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  HIGH: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  URGENT: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const statusColors: Record<string, string> = {
  TODO: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  IN_PROGRESS: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  REVIEW: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  COMPLETED: "text-green-400 bg-green-400/10 border-green-400/20",
};

export const projectStatusColors: Record<string, string> = {
  ACTIVE: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  COMPLETED: "text-green-400 bg-green-400/10 border-green-400/20",
  ON_HOLD: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function getProjectProgress(tasks: { status: string }[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  return Math.round((completed / tasks.length) * 100);
}
