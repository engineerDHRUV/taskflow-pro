"use client";
import { motion } from "framer-motion";
import { Search, Command, HelpCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { useIntegrationStore } from "@/store/integrationStore";
import { getInitials } from "@/lib/utils";
import NotificationPanel from "@/components/ui/NotificationPanel";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleCommandPalette } = useAppStore();
  const { startTour } = useIntegrationStore();

  return (
    <motion.header
      animate={{ paddingLeft: sidebarOpen ? "296px" : "88px" }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 left-0 h-[72px] z-30 glass-dark border-b border-white/5 flex items-center px-6 gap-4"
    >
      {/* Search / Command Palette */}
      <button
        onClick={toggleCommandPalette}
        className="flex items-center gap-3 flex-1 max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#94a3b8] hover:border-purple-500/50 hover:text-white transition-all group"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm flex-1 text-left">Search anything...</span>
        <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded-md">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Tour button */}
        <button
          onClick={startTour}
          className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
          title="Start Tour"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <NotificationPanel />

        {/* User avatar */}
        <Link href="/profile" className="flex items-center gap-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{user?.name}</p>
            <p className="text-xs text-purple-400">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name || "U")
            )}
          </div>
        </Link>
      </div>
    </motion.header>
  );
}
