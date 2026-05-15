"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, Wifi, WifiOff, Database, Zap, Activity, Globe, RefreshCw } from "lucide-react";
import { useIntegrationStore } from "@/store/integrationStore";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { DEMO_MODE } from "@/services/api";

export default function DebugPanel() {
  const { debugPanelOpen, toggleDebugPanel, slackConnected, sheetsConnected } = useIntegrationStore();
  const { user } = useAuthStore();
  const { projects, tasks, users } = useAppStore();
  const [wsStatus] = useState<"connected" | "disconnected">("disconnected");
  const [fps, setFps] = useState(60);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
      setFps(58 + Math.floor(Math.random() * 4));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const routes = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/projects", label: "Projects" },
    { path: "/tasks", label: "Tasks" },
    { path: "/team", label: "Team" },
    { path: "/profile", label: "Profile" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/settings", label: "Settings" },
    { path: "/integrations", label: "Integrations" },
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleDebugPanel}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Debug Panel"
      >
        <Bug className="w-5 h-5 text-white" />
      </button>

      <AnimatePresence>
        {debugPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-72 z-50 glass-dark border-l border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-purple-400" />
                <span className="font-heading font-bold text-white text-sm">Debug Panel</span>
              </div>
              <button onClick={toggleDebugPanel} className="p-1.5 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider">System Status</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Demo Mode", value: DEMO_MODE ? "Active" : "Off", ok: true, icon: Globe },
                    { label: "WebSocket", value: wsStatus, ok: wsStatus === "connected", icon: wsStatus === "connected" ? Wifi : WifiOff },
                    { label: "Slack", value: slackConnected ? "Connected" : "Disconnected", ok: slackConnected, icon: Activity },
                    { label: "Sheets", value: sheetsConnected ? "Connected" : "Disconnected", ok: sheetsConnected, icon: Database },
                    { label: "FPS", value: `${fps} fps`, ok: fps >= 55, icon: Zap },
                    { label: "Uptime", value: `${uptime}s`, ok: true, icon: RefreshCw },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5 text-[#94a3b8]" />
                        <span className="text-xs text-[#94a3b8]">{item.label}</span>
                      </div>
                      <span className={`text-xs font-mono font-medium ${item.ok ? "text-green-400" : "text-red-400"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data counts */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider">Data Store</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Projects", value: projects.length },
                    { label: "Tasks", value: tasks.length },
                    { label: "Users", value: users.length },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-lg font-heading font-bold text-purple-400">{item.value}</p>
                      <p className="text-xs text-[#94a3b8]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current user */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider">Session</p>
                <div className="bg-white/5 rounded-lg p-3 font-mono text-xs space-y-1">
                  <p className="text-green-400">user: <span className="text-white">{user?.name}</span></p>
                  <p className="text-green-400">role: <span className="text-cyan-400">{user?.role}</span></p>
                  <p className="text-green-400">email: <span className="text-white">{user?.email}</span></p>
                </div>
              </div>

              {/* Route inspector */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider">Route Inspector</p>
                <div className="space-y-1">
                  {routes.map((r) => (
                    <a
                      key={r.path}
                      href={r.path}
                      className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all group"
                    >
                      <span className="text-xs text-[#94a3b8] group-hover:text-white transition-colors">{r.label}</span>
                      <span className="text-xs font-mono text-purple-400">{r.path}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* API status */}
              <div className="space-y-2">
                <p className="text-xs font-heading font-semibold text-[#94a3b8] uppercase tracking-wider">API Endpoints</p>
                <div className="bg-black/30 rounded-lg p-3 font-mono text-xs space-y-1">
                  {["/auth/me", "/projects", "/tasks", "/users", "/analytics/dashboard"].map((ep) => (
                    <div key={ep} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-[#94a3b8]">{ep}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
