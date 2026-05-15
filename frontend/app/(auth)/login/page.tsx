"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, Shield, Copy, Check, ChevronDown } from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), { ssr: false });

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_CREDS = {
  ADMIN: { email: "admin@taskflow.pro", password: "admin123", role: "ADMIN" },
  MEMBER: { email: "member@taskflow.pro", password: "member123", role: "MEMBER" },
};

function EvaluatorCard({ type, creds }: { type: "ADMIN" | "MEMBER"; creds: typeof DEMO_CREDS.ADMIN }) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      className="relative w-56 h-36 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl glass gradient-border flex flex-col items-center justify-center gap-2"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === "ADMIN" ? "bg-purple-500/20" : "bg-cyan-500/20"}`}>
            <Shield className={`w-5 h-5 ${type === "ADMIN" ? "text-purple-400" : "text-cyan-400"}`} />
          </div>
          <p className="font-heading font-bold text-white">{type}</p>
          <p className="text-xs text-[#94a3b8]">Click to reveal</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl glass gradient-border p-3 flex flex-col gap-2"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-xs font-heading font-bold text-purple-400 mb-1">{type} CREDENTIALS</p>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-[#94a3b8] truncate">{creds.email}</span>
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(creds.email, "email"); }}
              className="p-1 hover:text-purple-400 transition-colors"
            >
              {copied === "email" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-[#94a3b8]">{creds.password}</span>
            <button
              onClick={(e) => { e.stopPropagation(); copyToClipboard(creds.password, "pass"); }}
              className="p-1 hover:text-purple-400 transition-colors"
            >
              {copied === "pass" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEvaluator, setShowEvaluator] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "MEMBER", rememberMe: false },
  });

  // Particle canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const mouse = { x: 0, y: 0 };

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= (dx / dist) * 0.02;
          p.vy -= (dy / dist) * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email: data.email, password: data.password });
      const { user, token } = res.data.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}! 🚀`);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (type: "ADMIN" | "MEMBER") => {
    const creds = DEMO_CREDS[type];
    setValue("email", creds.email);
    setValue("password", creds.password);
    toast.success(`${type} credentials filled!`);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden animated-gradient flex items-center justify-center">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* 3D Scene */}
      <Scene3D />

      {/* Nebula gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center glow-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>
          <p className="text-[#94a3b8] text-sm">Futuristic Collaborative Task Management</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="w-full max-w-md"
        >
          <div className="glass gradient-border rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-heading font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-[#94a3b8] text-sm">Sign in to your workspace</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Role Selector */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                {(["MEMBER", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue("role", r)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-600 data-[active=true]:to-cyan-600 data-[active=true]:text-white text-[#94a3b8] hover:text-white"
                    data-active={undefined}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm text-[#94a3b8] font-medium">Email</label>
                <div className="relative">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#94a3b8] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-sm text-[#94a3b8] font-medium">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-[#94a3b8] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-purple-500"
                />
                <label htmlFor="rememberMe" className="text-sm text-[#94a3b8]">Remember me</label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-heading font-semibold text-white relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </form>

            {/* Quick fill buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => fillDemo("ADMIN")}
                className="flex-1 py-2 text-xs border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all"
              >
                Fill Admin Demo
              </button>
              <button
                onClick={() => fillDemo("MEMBER")}
                className="flex-1 py-2 text-xs border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all"
              >
                Fill Member Demo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Evaluator Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-lg"
        >
          <button
            onClick={() => setShowEvaluator(!showEvaluator)}
            className="w-full flex items-center justify-between px-6 py-3 glass gradient-border rounded-xl text-sm font-heading font-medium text-purple-400 hover:text-white transition-all"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Evaluator Quick Access
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showEvaluator ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showEvaluator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 glass gradient-border rounded-xl p-6">
                  <p className="text-center text-xs text-[#94a3b8] mb-4 font-mono">
                    // DEMO CREDENTIALS — FLIP CARDS TO REVEAL
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <EvaluatorCard type="ADMIN" creds={DEMO_CREDS.ADMIN} />
                    <EvaluatorCard type="MEMBER" creds={DEMO_CREDS.MEMBER} />
                  </div>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg font-mono text-xs text-green-400">
                    <p className="text-[#94a3b8]">$ taskflow --demo</p>
                    <p>✓ Admin: admin@taskflow.pro / admin123</p>
                    <p>✓ Member: member@taskflow.pro / member123</p>
                    <p className="text-purple-400 animate-pulse">█</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
