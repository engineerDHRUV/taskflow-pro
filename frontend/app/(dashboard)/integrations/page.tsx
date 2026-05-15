"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, Table2, Plug, CheckCircle, XCircle, RefreshCw, Plus, Trash2,
  Download, Upload, Clock, AlertCircle, Zap, ExternalLink, Copy, Check
} from "lucide-react";
import { useIntegrationStore } from "@/store/integrationStore";
import { useAppStore } from "@/store/appStore";
import { mockTasks } from "@/lib/mockData";
import { formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";

// ── Slack Integration Panel ───────────────────────────────────────────────────
function SlackPanel() {
  const { slackConnected, slackWorkspace, slackMessages, connectSlack, disconnectSlack, addSlackMessage, setSlackLastSync, addNotification } = useIntegrationStore();
  const [syncing, setSyncing] = useState(false);
  const [channel, setChannel] = useState("#taskflow-updates");

  const handleConnect = () => {
    // Simulate OAuth flow
    toast.loading("Connecting to Slack...", { id: "slack" });
    setTimeout(() => {
      connectSlack({
        id: "ws-1",
        name: "TaskFlow Workspace",
        icon: "https://api.dicebear.com/7.x/shapes/svg?seed=slack",
        connected: true,
        lastSync: new Date().toISOString(),
        channel,
      });
      addNotification({ title: "Slack Connected!", message: "Your Slack workspace is now connected.", type: "slack" });
      toast.success("Slack connected!", { id: "slack" });
    }, 1500);
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const msgs = [
        { id: `m-${Date.now()}-1`, user: "Dhruv Admin", text: "🚀 TaskFlow Pro deployment successful!", channel: "#general", ts: new Date().toISOString() },
        { id: `m-${Date.now()}-2`, user: "Alex Member", text: "Dashboard Analytics task moved to Review ✅", channel: "#taskflow-updates", ts: new Date(Date.now() - 300000).toISOString() },
        { id: `m-${Date.now()}-3`, user: "Priya Sharma", text: "New task assigned: Team Management Page", channel: "#taskflow-updates", ts: new Date(Date.now() - 600000).toISOString() },
        { id: `m-${Date.now()}-4`, user: "Rahul Dev", text: "Deepfake detection model accuracy: 94.2% 🎯", channel: "#ai-projects", ts: new Date(Date.now() - 900000).toISOString() },
      ];
      msgs.forEach((m) => addSlackMessage(m));
      setSlackLastSync(new Date().toISOString());
      addNotification({ title: "Slack Synced", message: `${msgs.length} new messages imported.`, type: "slack" });
      setSyncing(false);
      toast.success("Slack messages synced!");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Connection card */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4A154B] rounded-xl flex items-center justify-center">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white">Slack</h3>
              <p className="text-sm text-[#94a3b8]">Team communication & notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {slackConnected ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-[#94a3b8] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full" />
                Disconnected
              </span>
            )}
          </div>
        </div>

        {slackConnected && slackWorkspace ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-[#94a3b8]">Workspace</p>
                <p className="text-sm font-medium text-white mt-0.5">{slackWorkspace.name}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-[#94a3b8]">Last Sync</p>
                <p className="text-sm font-medium text-white mt-0.5">
                  {slackWorkspace.lastSync ? formatRelativeTime(slackWorkspace.lastSync) : "Never"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm text-[#94a3b8] mb-1 block">Notification Channel</label>
              <input
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all text-sm"
                placeholder="#channel-name"
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white text-sm font-medium disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Now"}
              </motion.button>
              <button
                onClick={disconnectSlack}
                className="px-4 py-2.5 border border-red-500/30 rounded-xl text-red-400 text-sm hover:bg-red-500/10 transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#94a3b8]">Connect your Slack workspace to receive real-time task notifications, sync project updates, and collaborate seamlessly.</p>
            <div className="space-y-2">
              {["Task assigned notifications", "Deadline reminders", "Project activity feed", "Team mentions sync"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              className="flex items-center gap-2 px-5 py-3 bg-[#4A154B] hover:bg-[#611f69] rounded-xl text-white font-medium transition-all"
            >
              <Hash className="w-4 h-4" />
              Connect with Slack
            </motion.button>
          </div>
        )}
      </div>

      {/* Messages feed */}
      {slackConnected && slackMessages.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h4 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-400" />
            Recent Slack Messages
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {slackMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-xs font-bold text-purple-400 flex-shrink-0">
                  {msg.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{msg.user}</span>
                    <span className="text-xs text-purple-400">{msg.channel}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{msg.text}</p>
                  <p className="text-xs text-[#94a3b8]/60 mt-1">{formatRelativeTime(msg.ts)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Google Sheets Integration Panel ──────────────────────────────────────────
function SheetsPanel() {
  const { sheetsConnected, sheetSyncs, connectSheets, disconnectSheets, addSheetSync, updateSheetSync, removeSheetSync, addNotification } = useIntegrationStore();
  const { tasks, projects } = useAppStore();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSheet, setNewSheet] = useState({ sheetId: "", sheetName: "", type: "tasks" as const });
  const [exportPreview, setExportPreview] = useState<any[] | null>(null);

  const handleConnect = () => {
    toast.loading("Connecting to Google Sheets...", { id: "sheets" });
    setTimeout(() => {
      connectSheets();
      addSheetSync({
        id: "sync-1",
        sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
        sheetName: "TaskFlow Tasks",
        type: "tasks",
        status: "idle",
        rowCount: 0,
      });
      addNotification({ title: "Google Sheets Connected!", message: "Your spreadsheet is ready for sync.", type: "sheets" });
      toast.success("Google Sheets connected!", { id: "sheets" });
    }, 1500);
  };

  const handleSync = (syncId: string, type: string) => {
    setSyncing(syncId);
    updateSheetSync(syncId, { status: "syncing" });
    setTimeout(() => {
      const count = type === "tasks" ? tasks.length : projects.length;
      updateSheetSync(syncId, {
        status: "success",
        lastSync: new Date().toISOString(),
        rowCount: count,
      });
      addNotification({ title: "Sheets Synced", message: `${count} rows exported successfully.`, type: "sheets" });
      setSyncing(null);
      toast.success(`Synced ${count} rows to Google Sheets!`);
    }, 2500);
  };

  const handleExport = () => {
    const data = tasks.slice(0, 5).map((t) => ({
      Title: t.title,
      Status: t.status,
      Priority: t.priority,
      Assignee: t.assignee?.name || "Unassigned",
      "Due Date": t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—",
      Project: t.project?.title || "—",
    }));
    setExportPreview(data);
  };

  return (
    <div className="space-y-4">
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0F9D58] rounded-xl flex items-center justify-center">
              <Table2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white">Google Sheets</h3>
              <p className="text-sm text-[#94a3b8]">Export & sync data to spreadsheets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sheetsConnected ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-[#94a3b8] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Disconnected
              </span>
            )}
          </div>
        </div>

        {sheetsConnected ? (
          <div className="space-y-4">
            {/* Sync list */}
            <div className="space-y-3">
              {sheetSyncs.map((sync) => (
                <div key={sync.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{sync.sheetName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-purple-400 capitalize">{sync.type}</span>
                      {sync.rowCount !== undefined && <span className="text-xs text-[#94a3b8]">{sync.rowCount} rows</span>}
                      {sync.lastSync && <span className="text-xs text-[#94a3b8]">· {formatRelativeTime(sync.lastSync)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sync.status === "syncing" ? (
                      <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : sync.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : sync.status === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#94a3b8]" />
                    )}
                    <button
                      onClick={() => handleSync(sync.id, sync.type)}
                      disabled={syncing === sync.id}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncing === sync.id ? "animate-spin" : ""}`} />
                    </button>
                    <button
                      onClick={() => removeSheetSync(sync.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg text-[#94a3b8] hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export Preview
              </motion.button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 glass border border-white/10 rounded-xl text-[#94a3b8] hover:text-white text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Sheet
              </button>
              <button
                onClick={disconnectSheets}
                className="px-4 py-2.5 border border-red-500/30 rounded-xl text-red-400 text-sm hover:bg-red-500/10 transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#94a3b8]">Export tasks, analytics, and team data to Google Sheets for advanced reporting and sharing.</p>
            <div className="space-y-2">
              {["Export tasks to spreadsheet", "Import tasks from sheets", "Sync analytics data", "Auto-scheduled sync", "Conflict resolution"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              className="flex items-center gap-2 px-5 py-3 bg-[#0F9D58] hover:bg-[#0b8a4d] rounded-xl text-white font-medium transition-all"
            >
              <Table2 className="w-4 h-4" />
              Connect Google Sheets
            </motion.button>
          </div>
        )}
      </div>

      {/* Export preview */}
      <AnimatePresence>
        {exportPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass rounded-2xl p-6 border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-semibold text-white">Export Preview</h4>
              <button onClick={() => setExportPreview(null)} className="text-[#94a3b8] hover:text-white transition-colors">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    {Object.keys(exportPreview[0] || {}).map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-[#94a3b8] font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exportPreview.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="py-2 px-3 text-white">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">Showing {exportPreview.length} of {tasks.length} tasks</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Integrations Page ────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"slack" | "sheets" | "webhooks">("slack");
  const { slackConnected, sheetsConnected } = useIntegrationStore();

  const tabs = [
    { id: "slack" as const, label: "Slack", icon: Hash, connected: slackConnected, color: "bg-[#4A154B]" },
    { id: "sheets" as const, label: "Google Sheets", icon: Table2, connected: sheetsConnected, color: "bg-[#0F9D58]" },
    { id: "webhooks" as const, label: "Webhooks", icon: Zap, connected: false, color: "bg-orange-600" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
          <Plug className="w-8 h-8 text-purple-400" />
          Integrations
        </h1>
        <p className="text-[#94a3b8] mt-1">Connect your favorite tools and automate your workflow</p>
      </motion.div>

      {/* Tab selector */}
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              activeTab === tab.id
                ? "border-purple-500/50 bg-purple-500/10 text-white"
                : "border-white/10 text-[#94a3b8] hover:text-white hover:border-white/20"
            }`}
          >
            <div className={`w-5 h-5 ${tab.color} rounded flex items-center justify-center`}>
              <tab.icon className="w-3 h-3 text-white" />
            </div>
            {tab.label}
            {tab.connected && <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "slack" && <SlackPanel />}
          {activeTab === "sheets" && <SheetsPanel />}
          {activeTab === "webhooks" && (
            <div className="glass gradient-border rounded-2xl p-8 text-center">
              <Zap className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-white text-xl mb-2">Webhooks</h3>
              <p className="text-[#94a3b8] mb-6">Send real-time events to any URL when tasks, projects, or team changes occur.</p>
              <div className="max-w-md mx-auto space-y-3">
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-all text-sm" placeholder="https://your-webhook-url.com/hook" />
                <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-medium hover:opacity-90 transition-all">
                  Add Webhook
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
