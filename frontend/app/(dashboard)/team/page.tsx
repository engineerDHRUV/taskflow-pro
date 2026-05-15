"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, CheckSquare, Star, Briefcase } from "lucide-react";
import { usersApi, tasksApi } from "@/services/api";
import { User, Task } from "@/types";
import { useAppStore } from "@/store/appStore";
import { getInitials, cn } from "@/lib/utils";
import toast from "react-hot-toast";

function MemberCard({ user, tasks }: { user: User; tasks: Task[] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const userTasks = tasks.filter((t) => t.assigneeId === user.id);
  const completedTasks = userTasks.filter((t) => t.status === "COMPLETED").length;
  const completionRate = userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass gradient-border rounded-2xl p-6 group relative overflow-hidden"
      style={{ transition: "transform 0.1s ease", width: "100%", minHeight: "420px" }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar with animated ring */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-spin-slow opacity-60" style={{ padding: "2px" }} />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white overflow-hidden relative z-10 border-2 border-[#050816]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#050816] z-20" />
        </div>

        <h3 className="font-heading font-bold text-white text-lg">{user.name}</h3>
        <span className={cn(
          "mt-1 px-3 py-0.5 rounded-full text-xs font-medium border",
          user.role === "ADMIN" ? "text-purple-400 bg-purple-400/10 border-purple-400/20" : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
        )}>
          {user.role}
        </span>

        {user.bio && (
          <p className="text-[#94a3b8] text-sm mt-3 line-clamp-2">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-heading font-bold text-purple-400">{userTasks.length}</p>
            <p className="text-xs text-[#94a3b8]">Tasks</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-heading font-bold text-cyan-400">{completionRate}%</p>
            <p className="text-xs text-[#94a3b8]">Done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full mt-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
            {user.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[#94a3b8]">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="flex gap-2 mt-4">
          <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-purple-400 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{user.email}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const { users, setUsers, tasks, setTasks } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, tRes] = await Promise.all([usersApi.getAll(), tasksApi.getAll()]);
        setUsers(uRes.data.data);
        setTasks(tRes.data.data);
      } catch { toast.error("Failed to load team"); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Team</h1>
        <p className="text-[#94a3b8] mt-1">{users.length} members</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/5 animate-pulse h-[420px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <MemberCard user={user} tasks={tasks} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
