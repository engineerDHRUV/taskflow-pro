"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderKanban, Calendar, Users, Trash2, Edit, X, Check } from "lucide-react";
import { projectsApi, usersApi } from "@/services/api";
import { Project, User } from "@/types";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { formatDate, getProjectProgress, projectStatusColors, cn } from "@/lib/utils";
import toast from "react-hot-toast";

function ProjectCard({ project, onDelete, onEdit, isAdmin }: {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (p: Project) => void;
  isAdmin: boolean;
}) {
  const progress = getProjectProgress(project.tasks || []);
  const statusColor = projectStatusColors[project.status] || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass gradient-border rounded-2xl p-6 group relative overflow-hidden cursor-pointer"
      style={{ width: "100%", minHeight: "220px" }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-white text-lg truncate">{project.title}</h3>
            <p className="text-[#94a3b8] text-sm mt-1 line-clamp-2">{project.description || "No description"}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(project)} className="p-1.5 rounded-lg hover:bg-purple-500/20 text-[#94a3b8] hover:text-purple-400 transition-all">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(project.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-[#94a3b8] hover:text-red-400 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status badge */}
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColor)}>
          {project.status.replace("_", " ")}
        </span>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#94a3b8] mb-1.5">
            <span>Progress</span>
            <span className="text-purple-400 font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{project.deadline ? formatDate(project.deadline) : "No deadline"}</span>
          </div>
          <div className="flex -space-x-2">
            {project.teamMembers?.slice(0, 3).map((m) => (
              <div key={m.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-2 border-[#050816] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                {m.user.avatar ? <img src={m.user.avatar} alt={m.user.name} className="w-full h-full object-cover" /> : m.user.name[0]}
              </div>
            ))}
            {(project.teamMembers?.length || 0) > 3 && (
              <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#050816] flex items-center justify-center text-xs text-[#94a3b8]">
                +{(project.teamMembers?.length || 0) - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ onClose, onSave, project, users }: {
  onClose: () => void;
  onSave: (data: any) => void;
  project?: Project | null;
  users: User[];
}) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "ACTIVE",
    deadline: project?.deadline ? project.deadline.split("T")[0] : "",
    memberIds: project?.teamMembers?.map((m) => m.user.id) || [],
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
          <h2 className="text-xl font-heading font-bold text-white">{project ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all"
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
              rows={3}
              placeholder="Project description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#94a3b8] mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all"
              >
                {["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"].map((s) => (
                  <option key={s} value={s} className="bg-[#0a0f2e]">{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] mb-1 block">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-white/10 rounded-xl text-[#94a3b8] hover:text-white hover:border-white/20 transition-all">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {project ? "Update" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const { projects, setProjects, addProject, updateProject, removeProject } = useAppStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, uRes] = await Promise.all([projectsApi.getAll(), usersApi.getAll()]);
        setProjects(pRes.data.data);
        setUsers(uRes.data.data);
      } catch { toast.error("Failed to load projects"); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSave = async (form: any) => {
    try {
      if (editProject) {
        const res = await projectsApi.update(editProject.id, form);
        updateProject(editProject.id, res.data.data);
        toast.success("Project updated!");
      } else {
        const res = await projectsApi.create(form);
        addProject(res.data.data);
        toast.success("Project created!");
      }
      setShowModal(false);
      setEditProject(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await projectsApi.delete(id);
      removeProject(id);
      toast.success("Project deleted");
    } catch { toast.error("Failed to delete project"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Projects</h1>
          <p className="text-[#94a3b8] mt-1">{projects.length} projects total</p>
        </div>
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setEditProject(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </motion.button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/5 animate-pulse h-[220px]" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban className="w-16 h-16 text-purple-400/30 mb-4" />
          <h3 className="text-xl font-heading font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-[#94a3b8]">{isAdmin ? "Create your first project to get started" : "You haven't been assigned to any projects"}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onEdit={(p) => { setEditProject(p); setShowModal(true); }}
                isAdmin={isAdmin}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <ProjectModal
            onClose={() => { setShowModal(false); setEditProject(null); }}
            onSave={handleSave}
            project={editProject}
            users={users}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
