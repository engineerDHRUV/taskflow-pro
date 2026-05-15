import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "cosmic" | "neon" | "ultra-dark" | "dark";

export interface SlackWorkspace {
  id: string; name: string; icon?: string; connected: boolean; lastSync?: string; channel?: string;
}
export interface GoogleSheetSync {
  id: string; sheetId: string; sheetName: string; type: "tasks" | "analytics" | "team";
  lastSync?: string; status: "idle" | "syncing" | "success" | "error"; rowCount?: number;
}
export interface Notification {
  id: string; title: string; message: string;
  type: "info" | "success" | "warning" | "error" | "slack" | "sheets";
  read: boolean; createdAt: string; link?: string;
}

interface IntegrationState {
  theme: Theme; setTheme: (t: Theme) => void;
  slackConnected: boolean; slackWorkspace: SlackWorkspace | null;
  slackMessages: { id: string; user: string; text: string; channel: string; ts: string }[];
  connectSlack: (ws: SlackWorkspace) => void; disconnectSlack: () => void;
  addSlackMessage: (msg: any) => void; setSlackLastSync: (ts: string) => void;
  sheetsConnected: boolean; sheetSyncs: GoogleSheetSync[];
  connectSheets: () => void; disconnectSheets: () => void;
  addSheetSync: (sync: GoogleSheetSync) => void;
  updateSheetSync: (id: string, data: Partial<GoogleSheetSync>) => void;
  removeSheetSync: (id: string) => void;
  notifications: Notification[]; unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void; markAllRead: () => void; clearNotifications: () => void;
  tourActive: boolean; tourStep: number;
  startTour: () => void; nextTourStep: () => void; endTour: () => void;
  debugPanelOpen: boolean; toggleDebugPanel: () => void;
}

export const useIntegrationStore = create<IntegrationState>()(
  persist(
    (set) => ({
      theme: "cosmic",
      setTheme: (theme) => set({ theme }),
      slackConnected: false, slackWorkspace: null, slackMessages: [],
      connectSlack: (ws) => set({ slackConnected: true, slackWorkspace: ws }),
      disconnectSlack: () => set({ slackConnected: false, slackWorkspace: null, slackMessages: [] }),
      addSlackMessage: (msg) => set((s) => ({ slackMessages: [msg, ...s.slackMessages].slice(0, 50) })),
      setSlackLastSync: (ts) => set((s) => ({
        slackWorkspace: s.slackWorkspace ? { ...s.slackWorkspace, lastSync: ts } : null,
      })),
      sheetsConnected: false, sheetSyncs: [],
      connectSheets: () => set({ sheetsConnected: true }),
      disconnectSheets: () => set({ sheetsConnected: false, sheetSyncs: [] }),
      addSheetSync: (sync) => set((s) => ({ sheetSyncs: [...s.sheetSyncs, sync] })),
      updateSheetSync: (id, data) => set((s) => ({
        sheetSyncs: s.sheetSyncs.map((sync) => sync.id === id ? { ...sync, ...data } : sync),
      })),
      removeSheetSync: (id) => set((s) => ({ sheetSyncs: s.sheetSyncs.filter((x) => x.id !== id) })),
      notifications: [
        { id: "n1", title: "Welcome to TaskFlow Pro!", message: "Your workspace is ready. Explore all features.", type: "success" as const, read: false, createdAt: "2026-05-14T10:00:00Z" },
        { id: "n2", title: "Task Assigned", message: "Dashboard Analytics Charts has been assigned to you.", type: "info" as const, read: false, createdAt: "2026-05-14T09:00:00Z" },
        { id: "n3", title: "Deadline Approaching", message: "Kanban Drag & Drop Board is due in 2 days.", type: "warning" as const, read: false, createdAt: "2026-05-14T08:00:00Z" },
      ],
      unreadCount: 3,
      addNotification: (n) => {
        const notif: Notification = { ...n, id: `n-${Date.now()}`, createdAt: new Date().toISOString(), read: false };
        set((s) => ({ notifications: [notif, ...s.notifications], unreadCount: s.unreadCount + 1 }));
      },
      markRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, s.unreadCount - 1),
      })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
      tourActive: false, tourStep: 0,
      startTour: () => set({ tourActive: true, tourStep: 0 }),
      nextTourStep: () => set((s) => s.tourStep >= 5 ? { tourActive: false, tourStep: 0 } : { tourStep: s.tourStep + 1 }),
      endTour: () => set({ tourActive: false, tourStep: 0 }),
      debugPanelOpen: false,
      toggleDebugPanel: () => set((s) => ({ debugPanelOpen: !s.debugPanelOpen })),
    }),
    {
      name: "taskflow_integrations",
      partialize: (s) => ({ theme: s.theme, slackConnected: s.slackConnected, slackWorkspace: s.slackWorkspace, sheetsConnected: s.sheetsConnected, sheetSyncs: s.sheetSyncs }),
    }
  )
);