"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, XCircle, Hash } from "lucide-react";
import { useIntegrationStore } from "@/store/integrationStore";
import { formatRelativeTime } from "@/lib/utils";
import { useState } from "react";

const typeIcons: Record<string, any> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  slack: Hash,
  sheets: CheckCircle,
};

const typeColors: Record<string, string> = {
  info: "text-cyan-400 bg-cyan-400/10",
  success: "text-green-400 bg-green-400/10",
  warning: "text-yellow-400 bg-yellow-400/10",
  error: "text-red-400 bg-red-400/10",
  slack: "text-purple-400 bg-purple-400/10",
  sheets: "text-green-400 bg-green-400/10",
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead, clearNotifications } = useIntegrationStore();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 glass rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-0 top-12 w-80 glass-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span className="font-heading font-semibold text-white text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">{unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={markAllRead} className="p-1.5 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-all" title="Mark all read">
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={clearNotifications} className="p-1.5 hover:bg-red-500/20 rounded-lg text-[#94a3b8] hover:text-red-400 transition-all" title="Clear all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[#94a3b8] text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const Icon = typeIcons[n.type] || Info;
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${!n.read ? "bg-purple-500/5" : ""}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${n.read ? "text-[#94a3b8]" : "text-white"}`}>{n.title}</p>
                          <p className="text-xs text-[#94a3b8] mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-[#94a3b8]/60 mt-1">{formatRelativeTime(n.createdAt)}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0 mt-1.5" />}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
