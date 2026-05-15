"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <div className="text-[120px] font-heading font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none mb-4">
          404
        </div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-[#94a3b8] mb-8">The page you're looking for doesn't exist in this dimension.</p>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-heading font-semibold mx-auto"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
