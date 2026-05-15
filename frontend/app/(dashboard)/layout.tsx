"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import CommandPalette from "@/components/ui/CommandPalette";
import CustomCursor from "@/components/ui/CustomCursor";
import DebugPanel from "@/components/ui/DebugPanel";
import TourGuide from "@/components/ui/TourGuide";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Custom cursor */}
      <CustomCursor />

      {/* Command palette */}
      <CommandPalette />

      {/* Tour guide */}
      <TourGuide />

      {/* Debug panel */}
      <DebugPanel />

      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-900/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/3 rounded-full blur-3xl" />
      </div>

      <Sidebar />
      <Navbar />

      <motion.main
        animate={{ paddingLeft: sidebarOpen ? "296px" : "88px" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="pt-[72px] min-h-screen relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
}
