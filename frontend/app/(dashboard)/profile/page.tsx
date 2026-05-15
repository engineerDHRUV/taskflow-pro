"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save, X, Plus, Trash2, CheckSquare, FolderKanban, Award } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { usersApi, tasksApi, projectsApi } from "@/services/api";
import { Task, Project } from "@/types";
import { getInitials, formatDate, priorityColors, statusColors, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
    avatar: user?.avatar || "",
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          tasksApi.getAll({ assigneeId: user?.id }),
          projectsApi.getAll(),
        ]);
        setTasks(tRes.data.data);
        setProjects(pRes.data.data);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [user?.id]);

  const handleSave = async () => {
    try {
      const res = await usersApi.update(user!.id, form);
      setUser(res.data.data);
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const achievements = [
    { label: "Task Master", desc: `${completedTasks} tasks completed`, icon: "🏆", unlocked: completedTasks >= 5 },
    { label: "Team Player", desc: "Joined a project", icon: "🤝", unlocked: projects.length > 0 },
    { label: "Early Bird", desc: "Joined TaskFlow", icon: "🌟", unlocked: true },
    { label: "Productivity Pro", desc: "80%+ completion rate", icon: "⚡", unlocked: completionRate >= 80 },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-white">Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-[#94a3b8] hover:text-white transition-all">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-[#94a3b8] hover:text-white transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Profile Card */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass gradient-border rounded-2xl p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border-4 border-purple-500/30">
                  {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : getInitials(user?.name || "U")}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-[#050816]" />
              </div>

              {editing ? (
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 w-full mb-2" />
              ) : (
                <h2 className="text-xl font-heading font-bold text-white">{user?.name}</h2>
              )}
              <span className={cn("mt-1 px-3 py-0.5 rounded-full text-xs font-medium border",
                user?.role === "ADMIN" ? "text-purple-400 bg-purple-400/10 border-purple-400/20" : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
              )}>
                {user?.role}
              </span>
              <p className="text-[#94a3b8] text-sm mt-1">{user?.email}</p>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-[#94a3b8] mb-1 block">Bio</label>
              {editing ? (
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                  rows={3} placeholder="Tell us about yourself" />
              ) : (
                <p className="text-sm text-[#94a3b8]">{user?.bio || "No bio yet"}</p>
              )}
            </div>

            {/* Member since */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-[#94a3b8]">Member since {user?.createdAt ? formatDate(user.createdAt) : "—"}</p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass gradient-border rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="Add skill" />
                <button onClick={addSkill} className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right — Stats & Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Tasks", value: tasks.length, icon: CheckSquare, color: "text-purple-400" },
              { label: "Completed", value: completedTasks, icon: CheckSquare, color: "text-green-400" },
              { label: "Projects", value: projects.length, icon: FolderKanban, color: "text-cyan-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 border border-white/5 text-center">
                <p className={cn("text-3xl font-heading font-bold", stat.color)}>{stat.value}</p>
                <p className="text-xs text-[#94a3b8] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Completion rate */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-white">Completion Rate</h3>
              <span className="text-2xl font-heading font-bold text-purple-400">{completionRate}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              />
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" /> Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div key={a.label} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all",
                  a.unlocked ? "bg-purple-500/10 border-purple-500/20" : "bg-white/5 border-white/5 opacity-40"
                )}>
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{a.label}</p>
                    <p className="text-xs text-[#94a3b8]">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="font-heading font-semibold text-white mb-4">Recent Tasks</h3>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", statusColors[task.status])}>
                    {task.status.replace("_", " ")}
                  </span>
                  <span className="text-sm text-white flex-1 truncate">{task.title}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-[#94a3b8] text-sm text-center py-4">No tasks assigned yet</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
