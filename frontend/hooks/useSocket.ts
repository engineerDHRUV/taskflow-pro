import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

export function useSocket(projectId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const { updateTask } = useAppStore();

  useEffect(() => {
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (projectId) socket.emit("join-project", projectId);
    });

    socket.on("task-updated", (data: { taskId: string; updates: any }) => {
      updateTask(data.taskId, data.updates);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, projectId]);

  const emitTaskUpdate = (taskId: string, updates: any) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("task-updated", { projectId, taskId, updates });
    }
  };

  return { emitTaskUpdate };
}
