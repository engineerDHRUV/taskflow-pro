"use client";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  change?: string;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, color, bgColor, borderColor, change, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "glass rounded-2xl p-6 border relative overflow-hidden group cursor-default",
        borderColor
      )}
    >
      {/* Shimmer */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow */}
      <div className={cn("absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity", bgColor)} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">{title}</p>
          <p className={cn("text-4xl font-heading font-bold", color)}>
            <CountUp end={value} duration={2} delay={delay} />
          </p>
          {change && (
            <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <span>↑</span> {change}
            </p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgColor)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
      </div>
    </motion.div>
  );
}
