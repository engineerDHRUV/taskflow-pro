"use client";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#050816] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-t-purple-500 border-r-cyan-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            TaskFlow Pro
          </h2>
          <div className="flex items-center gap-1 justify-center mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
