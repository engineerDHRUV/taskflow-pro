"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Palette, Shield, Globe, Save, Check,
  Moon, Sun, Zap, Eye, Volume2, VolumeX
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useIntegrationStore, Theme } from "@/store/integrationStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const THEMES: { id: Theme; label: string; desc: string; preview: string }[] = [
  { id: "cosmic", label: "Cosmic", desc: "Deep space purple & cyan", preview: "from-purple-900 to-cyan-900" },
  { id: "neon", label: "Neon", desc: "Electric neon glow", preview: "from-pink-900 to-purple-900" },
  { id: "ultra-dark", label: "Ultra Dark", desc: "Pure black minimal", preview: "from-gray-950 to-gray-900" },
  { id: "dark", label: "Dark", desc: "Classic dark mode", preview: "from-slate-900 to-slate-800" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300",
        checked ? "bg-gradient-to-r from-purple-500 to-cyan-500" : "bg-white/10"
      )}
    >
      <motion.div
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useIntegrationStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    taskCompleted: true,
    deadlineReminder: true,
    projectUpdates: false,
    slackMessages: true,
    emailDigest: false,
  });
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showActivity: true,
    publicProfile: false,
  });
  const [sounds, setSounds] = useState(true);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  const handleSave = () => {
    toast.success("Settings saved!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-400" />
          Settings
        </h1>
        <p className="text-[#94a3b8] mt-1">Manage your account preferences and workspace configuration</p>
      </motion.div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-48 flex-shrink-0 space-y-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/10 border border-purple-500/30 text-white"
                  : "text-[#94a3b8] hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-purple-400" : "")} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-4"
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="glass gradient-border rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-white text-lg">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                  {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-white">{user?.name}</p>
                  <p className="text-sm text-[#94a3b8]">{user?.email}</p>
                  <span className={cn("mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium border",
                    user?.role === "ADMIN" ? "text-purple-400 bg-purple-400/10 border-purple-400/20" : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
                  )}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#94a3b8] mb-1 block">Display Name</label>
                  <input defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all" />
                </div>
                <div>
                  <label className="text-sm text-[#94a3b8] mb-1 block">Email</label>
                  <input defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Bio</label>
                <textarea defaultValue={user?.bio} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all resize-none" />
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Timezone</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all">
                  <option className="bg-[#0a0f2e]">Asia/Kolkata (IST)</option>
                  <option className="bg-[#0a0f2e]">UTC</option>
                  <option className="bg-[#0a0f2e]">America/New_York</option>
                </select>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="glass gradient-border rounded-2xl p-6 space-y-6">
              <h2 className="font-heading font-semibold text-white text-lg">Appearance</h2>
              <div>
                <p className="text-sm text-[#94a3b8] mb-3">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); toast.success(`Theme: ${t.label}`); }}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-left",
                        theme === t.id ? "border-purple-500/50 bg-purple-500/10" : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={`h-8 rounded-lg bg-gradient-to-r ${t.preview} mb-2`} />
                      <p className="text-sm font-medium text-white">{t.label}</p>
                      <p className="text-xs text-[#94a3b8]">{t.desc}</p>
                      {theme === t.id && <Check className="w-4 h-4 text-purple-400 mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Sound Effects</p>
                  <p className="text-xs text-[#94a3b8]">Play sounds for notifications and actions</p>
                </div>
                <div className="flex items-center gap-2">
                  {sounds ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-[#94a3b8]" />}
                  <Toggle checked={sounds} onChange={setSounds} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Reduced Motion</p>
                  <p className="text-xs text-[#94a3b8]">Minimize animations for accessibility</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Compact Mode</p>
                  <p className="text-xs text-[#94a3b8]">Reduce spacing for more content</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="glass gradient-border rounded-2xl p-6 space-y-4">
              <h2 className="font-heading font-semibold text-white text-lg">Notification Preferences</h2>
              {Object.entries(notifications).map(([key, val]) => {
                const labels: Record<string, { title: string; desc: string }> = {
                  taskAssigned: { title: "Task Assigned", desc: "When a task is assigned to you" },
                  taskCompleted: { title: "Task Completed", desc: "When your tasks are marked complete" },
                  deadlineReminder: { title: "Deadline Reminder", desc: "24h before task due date" },
                  projectUpdates: { title: "Project Updates", desc: "When projects are modified" },
                  slackMessages: { title: "Slack Messages", desc: "Sync Slack notifications here" },
                  emailDigest: { title: "Email Digest", desc: "Daily summary via email" },
                };
                const info = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{info.title}</p>
                      <p className="text-xs text-[#94a3b8]">{info.desc}</p>
                    </div>
                    <Toggle checked={val} onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="glass gradient-border rounded-2xl p-6 space-y-4">
              <h2 className="font-heading font-semibold text-white text-lg">Privacy & Security</h2>
              {Object.entries(privacy).map(([key, val]) => {
                const labels: Record<string, { title: string; desc: string }> = {
                  showOnlineStatus: { title: "Show Online Status", desc: "Let team members see when you're active" },
                  showActivity: { title: "Show Activity Feed", desc: "Display your actions in team activity" },
                  publicProfile: { title: "Public Portfolio", desc: "Make your portfolio visible to everyone" },
                };
                const info = labels[key];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{info.title}</p>
                      <p className="text-xs text-[#94a3b8]">{info.desc}</p>
                    </div>
                    <Toggle checked={val} onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))} />
                  </div>
                );
              })}
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm font-medium text-white mb-3">Danger Zone</p>
                <button className="px-4 py-2 border border-red-500/30 rounded-xl text-red-400 text-sm hover:bg-red-500/10 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Save button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
