"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban, CheckSquare, Clock, AlertTriangle, Users, Activity,
  TrendingUp, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { analyticsApi } from "@/services/api";
import { DashboardData } from "@/types";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const COLORS = ["#94a3b8", "#06b6d4", "#f59e0b", "#22c55e"];
const PRIORITY_COLORS = ["#22c55e", "#f59e0b", "#f97316", "#ef4444"];

const weeklyData = [
  { day: "Mon", tasks: 4, completed: 3 },
  { day: "Tue", tasks: 7, completed: 5 },
  { day: "Wed", tasks: 5, completed: 4 },
  { day: "Thu", tasks: 9, completed: 7 },
  { day: "Fri", tasks: 6, completed: 6 },
  { day: "Sat", tasks: 3, completed: 2 },
  { day: "Sun", tasks: 2, completed: 1 },
];

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
      <div className="h-10 bg-white/10 rounded w-1/3" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsApi.dashboard();
        setData(res.data.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const pieData = data?.tasksByStatus?.map((s) => ({
    name: s.status.replace("_", " "),
    value: s._count.status,
  })) || [];

  const priorityData = data?.tasksByPriority?.map((p) => ({
    name: p.priority,
    value: p._count.priority,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-heading font-bold text-white">
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {user?.name?.split(" ")[0]}
          </span>{" "}
          👋
        </h1>
        <p className="text-[#94a3b8] mt-1">Here's what's happening with your projects today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {loading ? (
          Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Total Projects" value={data?.totalProjects || 0} icon={FolderKanban} color="text-purple-400" bgColor="bg-purple-500/10" borderColor="border-purple-500/20" delay={0} />
            <StatCard title="Total Tasks" value={data?.totalTasks || 0} icon={CheckSquare} color="text-cyan-400" bgColor="bg-cyan-500/10" borderColor="border-cyan-500/20" delay={0.1} />
            <StatCard title="Completed" value={data?.completedTasks || 0} icon={TrendingUp} color="text-green-400" bgColor="bg-green-500/10" borderColor="border-green-500/20" delay={0.2} />
            <StatCard title="Pending" value={data?.pendingTasks || 0} icon={Clock} color="text-yellow-400" bgColor="bg-yellow-500/10" borderColor="border-yellow-500/20" delay={0.3} />
            <StatCard title="Overdue" value={data?.overdueTasks || 0} icon={AlertTriangle} color="text-red-400" bgColor="bg-red-500/10" borderColor="border-red-500/20" delay={0.4} />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-semibold text-white">Weekly Productivity</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="tasksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "rgba(10,15,46,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "12px", color: "#f8fafc" }}
              />
              <Area type="monotone" dataKey="tasks" stroke="#7c3aed" fill="url(#tasksGrad)" strokeWidth={2} name="Total Tasks" />
              <Area type="monotone" dataKey="completed" stroke="#06b6d4" fill="url(#completedGrad)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Status Pie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-semibold text-white">Task Status</h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(10,15,46,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "12px", color: "#f8fafc" }} />
                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[#94a3b8] text-sm">No task data yet</div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h3 className="font-heading font-semibold text-white mb-6">Tasks by Priority</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "rgba(10,15,46,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "12px", color: "#f8fafc" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#94a3b8] text-sm">No priority data yet</div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-white/10 rounded w-3/4 mb-1" />
                    <div className="h-2 bg-white/10 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : data?.recentActivities?.length ? (
              data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 flex-shrink-0">
                    {getInitials(activity.user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{activity.action}</p>
                    <p className="text-xs text-[#94a3b8]">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#94a3b8] text-sm text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
