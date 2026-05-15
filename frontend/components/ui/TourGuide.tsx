"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useIntegrationStore } from "@/store/integrationStore";
import { X, ChevronRight, Zap } from "lucide-react";

const TOUR_STEPS = [
  {
    title: "Welcome to TaskFlow Pro! 🚀",
    description: "Let's take a quick tour of your futuristic workspace. This is your command center for managing projects, tasks, and your team.",
    position: "center",
  },
  {
    title: "Dashboard Analytics",
    description: "Your dashboard shows real-time stats, productivity charts, and activity feeds. Everything you need at a glance.",
    position: "center",
    highlight: "/dashboard",
  },
  {
    title: "Kanban Task Board",
    description: "Manage tasks with a beautiful drag-and-drop Kanban board. Move tasks between Todo, In Progress, Review, and Completed.",
    position: "center",
    highlight: "/tasks",
  },
  {
    title: "Command Palette",
    description: "Press Ctrl+K (or Cmd+K) anywhere to open the command palette for instant navigation.",
    position: "center",
  },
  {
    title: "Integrations",
    description: "Connect Slack for notifications and Google Sheets for data sync. Find these in the Settings & Integrations page.",
    position: "center",
  },
  {
    title: "Portfolio Page",
    description: "Your personal cinematic portfolio showcases your skills, experience, and projects to recruiters and collaborators.",
    position: "center",
    highlight: "/portfolio",
  },
];

export default function TourGuide() {
  const { tourActive, tourStep, nextTourStep, endTour } = useIntegrationStore();
  const step = TOUR_STEPS[tourStep];

  return (
    <AnimatePresence>
      {tourActive && step && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          {/* Tour card */}
          <motion.div
            key={tourStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="glass gradient-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="flex gap-1.5">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === tourStep ? "w-6 bg-purple-400" : i < tourStep ? "w-3 bg-purple-400/50" : "w-3 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-auto text-xs text-[#94a3b8]">{tourStep + 1}/{TOUR_STEPS.length}</span>
              </div>

              <h3 className="text-xl font-heading font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#94a3b8] leading-relaxed mb-6">{step.description}</p>

              {step.highlight && (
                <a
                  href={step.highlight}
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-4 transition-colors"
                  onClick={endTour}
                >
                  Go to {step.highlight} →
                </a>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={endTour}
                  className="text-sm text-[#94a3b8] hover:text-white transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Skip tour
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTourStep}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-medium text-sm"
                >
                  {tourStep === TOUR_STEPS.length - 1 ? "Finish 🎉" : "Next"}
                  {tourStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
