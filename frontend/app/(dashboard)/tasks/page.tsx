"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Calendar, Flag, User as UserIcon } from "lucide-react";
import { tasksApi, projectsApi, usersApi } from "@/services/api";
import { Task, Project, User, TaskStatus } from "@/types";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { priorityColors, statusColors, formatDate, getDaysUntil, cn } from "@/lib/utils";
import toast from "react-hot-toast";

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "TODO", label: "To Do", color: "border-slate-500/30" },
  { id: "IN_PROGRESS", label: "In Progress", color: "border-cyan-500/30" },
  { id: "REVIEW", label: "Review", color: "border-yellow-500/30" },
  { id: "COMPLETED", label: "Completed", color: "border-green-500/30" },
];

function TaskCard({ task, onUpdate, onDelete }: { task: Task; onUpdate: (id: string, data: any) => void; onDelete: (id: string) => void }) {
  const daysLeft = task.dueDate ? getDaysUntil(task.dueDate) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="glass rounded-xl p-4 border border-white/5 group cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-white leading-tight flex-1">{task.title}</h4>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-[#94a3b8] hover:text-red-400 transition-all flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-[#94a3b8] mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", priorityColors[task.priority])}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className={cn("text-xs flex items-center gap-1", isOverdue ? "text-red-400" : "text-[#94a3b8]")}>
            <Calendar className="w-3 h-3" />
            {isOverdue ? `${Math.abs(daysLeft!)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
          </span>
        )}
      </div>

      {task.assignee && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
            {task.assignee.avatar ? <img src={task.assignee.avatar} alt="" className="w-full h-full object-cover" /> : task.assignee.name[0]}
          </div>
          <span className="text-xs text-[#94a3b8]">{task.assignee.name}</span>
        </div>
      )}

      {/* Status change buttons */}
      <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {COLUMNS.filter((c) => c.id !== task.status).slice(0, 2).map((col) => (
          <button
            key={col.id}
            onClick={() => onUpdate(task.id, { status: col.id })}
            className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[#94a3b8] hover:text-white transition-all"
          >
            → {col.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function TaskModal({ onClose, onSave, projects, users }: {
  onClose: () => void;
  onSave: (data: any) => void;
  projects: Project[];
  users: User[];
}) {
  const [form, setForm] = useState({
    title: "", description: "", priority: "MEDIUM", status: "TODO",
    dueDate: "", assigneeId: "", projectId: "",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass gradient-border rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-white">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all"
              placeholder="Task title" />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
              rows={2} placeholder="Task description" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#94a3b8] mb-1 block">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all">
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => <option key={p} value={p} className="bg-[#0a0f2e]">{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Project *</label>
            <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all">
              <option value="" className="bg-[#0a0f2e]">Select project</option>
              {projects.map((p) => <option key={p.id} value={p.id} className="bg-[#0a0f2e]">{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Assignee</label>
            <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all">
              <option value="" className="bg-[#0a0f2e]">Unassigned</option>
              {users.map((u) => <option key={u.id} value={u.id} className="bg-[#0a0f2e]">{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-[#94a3b8] hover:text-white transition-all">Cancel</button>
          <button onClick={() => form.title && form.projectId && onSave(form)}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TasksPage() {
  const { tasks, setTasks, addTask, updateTask: updateTaskStore, removeTask } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, pRes, uRes] = await Promise.all([tasksApi.getAll(), projectsApi.getAll(), usersApi.getAll()]);
        setTasks(tRes.data.data);
        setProjects(pRes.data.data);
        setUsers(uRes.data.data);
      } catch { toast.error("Failed to load tasks"); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCreate = async (form: any) => {
    try {
      const res = await tasksApi.create(form);
      addTask(res.data.data);
      setShowModal(false);
      toast.success("Task created!");
    } catch (err: any) { toast.error(err.response?.data?.message || "Failed to create task"); }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const res = await tasksApi.update(id, data);
      updateTaskStore(id, res.data.data);
      toast.success("Task updated!");
    } catch { toast.error("Failed to update task"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await tasksApi.delete(id);
      removeTask(id);
      toast.success("Task deleted");
    } catch { toast.error("Failed to delete task"); }
  };

  const getColumnTasks = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Tasks</h1>
          <p className="text-[#94a3b8] mt-1">Kanban board — {tasks.length} tasks total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium"
        >
          <Plus className="w-4 h-4" /> New Task
        </motion.button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
        {COLUMNS.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div key={col.id} className={cn("glass rounded-2xl p-4 border min-h-[400px]", col.color)}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-white text-sm">{col.label}</h3>
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#94a3b8] font-medium">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {loading ? (
                    Array(2).fill(0).map((_, i) => (
                      <div key={i} className="glass rounded-xl p-4 border border-white/5 animate-pulse h-24" />
                    ))
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <TaskModal onClose={() => setShowModal(false)} onSave={handleCreate} projects={projects} users={users} />
        )}
      </AnimatePresence>
    </div>
  );
}
