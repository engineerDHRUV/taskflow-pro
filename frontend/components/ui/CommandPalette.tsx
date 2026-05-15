"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, LayoutDashboard, FolderKanban, CheckSquare, Users, User, Globe, X, Settings, Plug } from "lucide-react";
import { useAppStore } from "@/store/appStore";

const commands = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard", shortcut: "D" },
  { id: "projects", label: "Go to Projects", icon: FolderKanban, href: "/projects", shortcut: "P" },
  { id: "tasks", label: "Go to Tasks", icon: CheckSquare, href: "/tasks", shortcut: "T" },
  { id: "team", label: "Go to Team", icon: Users, href: "/team", shortcut: "M" },
  { id: "profile", label: "Go to Profile", icon: User, href: "/profile", shortcut: "U" },
  { id: "portfolio", label: "Go to Portfolio", icon: Globe, href: "/portfolio", shortcut: "O" },
  { id: "integrations", label: "Integrations", icon: Plug, href: "/integrations", shortcut: "I" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", shortcut: "S" },
];

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, toggleCommandPalette } = useAppStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback((href: string) => {
    router.push(href);
    toggleCommandPalette();
    setQuery("");
  }, [router, toggleCommandPalette]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === "Escape") {
        if (commandPaletteOpen) toggleCommandPalette();
      }
      if (commandPaletteOpen) {
        if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
        if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
        if (e.key === "Enter" && filtered[selected]) execute(filtered[selected].href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, filtered, selected, execute, toggleCommandPalette]);

  useEffect(() => setSelected(0), [query]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={toggleCommandPalette}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full max-w-lg glass gradient-border rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-[#94a3b8] flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-white placeholder-[#94a3b8] focus:outline-none text-sm"
              />
              <button onClick={toggleCommandPalette} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-[#94a3b8]" />
              </button>
            </div>

            {/* Results */}
            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-[#94a3b8] text-sm py-6">No commands found</p>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd.href)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      i === selected ? "bg-purple-500/20 text-white" : "text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    <cmd.icon className={`w-4 h-4 flex-shrink-0 ${i === selected ? "text-purple-400" : ""}`} />
                    <span className="flex-1 text-sm">{cmd.label}</span>
                    <kbd className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono">{cmd.shortcut}</kbd>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4 text-xs text-[#94a3b8]">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
