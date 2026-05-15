"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  Github, Linkedin, Mail, Phone, MapPin, Download, ExternalLink,
  Code2, Brain, Database, Globe, Cpu, Layers, ChevronDown, Star
} from "lucide-react";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), { ssr: false });

const skills = [
  { name: "Python", level: 90, category: "Language" },
  { name: "Machine Learning", level: 85, category: "AI/ML" },
  { name: "TypeScript", level: 80, category: "Language" },
  { name: "React / Next.js", level: 82, category: "Frontend" },
  { name: "Node.js / Express", level: 78, category: "Backend" },
  { name: "TensorFlow", level: 75, category: "AI/ML" },
  { name: "SQL / PostgreSQL", level: 80, category: "Database" },
  { name: "Computer Vision", level: 78, category: "AI/ML" },
  { name: "NLP / RAG", level: 72, category: "AI/ML" },
  { name: "Docker / Git", level: 70, category: "DevOps" },
];

const experiences = [
  {
    role: "AI & ML Intern",
    company: "Aikyam Design Studio",
    period: "Jan 2026 – Apr 2026",
    desc: "Developed professional website and AI-driven automation systems. Implemented AI tools and backend integration improving client workflows.",
    color: "from-purple-500 to-cyan-500",
  },
  {
    role: "AI and ML Intern",
    company: "Ansyst Consultancy",
    period: "Oct 2025 – Dec 2025",
    desc: "Built and optimized ML models (QnA), handled data preprocessing, feature engineering, NLP pipelines and production workflows using SQL and RAG.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    role: "Data Engineer Intern",
    company: "Shri Vishwakarma Skill University",
    period: "Feb 2025 – Jul 2025",
    desc: "Worked with Python, MS Excel, and data handling tools for ML-oriented development, data preprocessing and analysis.",
    color: "from-blue-500 to-purple-500",
  },
  {
    role: "Web Developer",
    company: "Balaji Public School & Nirvana Fragrances",
    period: "Mar 2024 – May 2024",
    desc: "Designed responsive, cross-browser websites using HTML5, CSS3, JavaScript with UX/UI best practices and on-page SEO.",
    color: "from-purple-500 to-pink-500",
  },
];

const projects = [
  {
    title: "AI Face Recognition Attendance System",
    tech: ["Python", "OpenCV", "CNNs", "NumPy"],
    desc: "Real-time facial recognition–based attendance system with improved accuracy and efficiency.",
    icon: "👁️",
    color: "from-purple-600/20 to-cyan-600/20",
  },
  {
    title: "AI Anime Translator with Lip-Sync",
    tech: ["Python", "Streamlit", "HuggingFace", "gTTS"],
    desc: "Bilingual EN–HI system integrating speech-to-text, TTS, and audio-driven lip-sync animation.",
    icon: "🎌",
    color: "from-cyan-600/20 to-blue-600/20",
  },
  {
    title: "Deepfake Detection System",
    tech: ["Python", "CNNs", "Transformers", "OpenCV"],
    desc: "Deep learning pipeline detecting manipulated media by analyzing spatial and temporal facial artifacts.",
    icon: "🔍",
    color: "from-red-600/20 to-purple-600/20",
  },
  {
    title: "AI-Integrated Business Dashboard",
    tech: ["HTML", "CSS", "JavaScript", "Supabase"],
    desc: "Full business website with admin dashboard, AI image generation and daily work-token tracking.",
    icon: "📊",
    color: "from-green-600/20 to-cyan-600/20",
  },
  {
    title: "TaskFlow Pro",
    tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    desc: "Production-ready full-stack collaborative task management with RBAC, real-time features and stunning UI.",
    icon: "⚡",
    color: "from-purple-600/20 to-pink-600/20",
  },
];

function SkillBar({ skill, delay }: { skill: typeof skills[0]; delay: number }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white font-medium">{skill.name}</span>
        <span className="text-purple-400">{skill.level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${skill.level}%` : 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
        />
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="space-y-0 -m-6">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Scene3D />

        {/* Nebula */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Profile photo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-[0_0_40px_rgba(124,58,237,0.4)]"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=dhruv&backgroundColor=b6e3f4"
              alt="Dhruv"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white mb-4 neon-text">
              DHRUV
            </h1>
            <div className="text-xl md:text-2xl text-[#94a3b8] mb-6 h-8">
              <TypeAnimation
                sequence={[
                  "AI/ML Engineer", 2000,
                  "Full-Stack Developer", 2000,
                  "Computer Vision Expert", 2000,
                  "NLP Specialist", 2000,
                ]}
                repeat={Infinity}
                className="text-purple-400 font-heading font-semibold"
              />
            </div>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-lg leading-relaxed">
              BTech CS (AI/ML) student at SVSU, Palwal. Building intelligent systems and beautiful interfaces.
              Passionate about the intersection of AI and modern web development.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <a href="mailto:22BTC35111@svsu.ac.in" className="flex items-center gap-2 px-5 py-2.5 glass gradient-border rounded-xl text-white hover:border-purple-500/50 transition-all group">
              <Mail className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">22BTC35111@svsu.ac.in</span>
            </a>
            <a href="tel:9599700715" className="flex items-center gap-2 px-5 py-2.5 glass gradient-border rounded-xl text-white hover:border-cyan-500/50 transition-all group">
              <Phone className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">9599700715</span>
            </a>
            <div className="flex items-center gap-2 px-5 py-2.5 glass gradient-border rounded-xl text-white">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-sm">Faridabad, Haryana</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center"
          >
            <ChevronDown className="w-6 h-6 text-purple-400 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* SKILLS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a0f2e]/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              Technical <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Arsenal</span>
            </h2>
            <p className="text-[#94a3b8]">Skills forged through real-world projects and internships</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <SkillBar skill={skill} delay={i * 0.1} />
              </motion.div>
            ))}
          </div>

          {/* Tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mt-8 justify-center"
          >
            {["NumPy", "Pandas", "Scikit-learn", "FAISS", "Power BI", "MongoDB", "Tailwind CSS", "Prisma", "Socket.io", "Framer Motion"].map((tech) => (
              <span key={tech} className="px-3 py-1.5 glass border border-white/10 rounded-full text-sm text-[#94a3b8] hover:text-white hover:border-purple-500/30 transition-all cursor-default">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              Work <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-cyan-500 to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-5 top-6 w-6 h-6 rounded-full bg-gradient-to-br ${exp.color} border-2 border-[#050816] flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="glass gradient-border rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-heading font-bold text-white text-lg">{exp.role}</h3>
                        <p className={`text-sm font-medium bg-gradient-to-r ${exp.color} bg-clip-text text-transparent`}>{exp.company}</p>
                      </div>
                      <span className="text-xs text-[#94a3b8] bg-white/5 px-3 py-1 rounded-full border border-white/10">{exp.period}</span>
                    </div>
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a0f2e]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              Featured <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass gradient-border rounded-2xl p-6 bg-gradient-to-br ${project.color} group cursor-pointer`}
              >
                <div className="text-4xl mb-4">{project.icon}</div>
                <h3 className="font-heading font-bold text-white mb-2">{project.title}</h3>
                <p className="text-[#94a3b8] text-sm mb-4 leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-[#94a3b8]">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Education</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { degree: "BTech CS (AI/ML)", school: "Shri Vishwakarma Skill University, Palwal", period: "2022–2026", grade: "6.8/10 CGPA", icon: "🎓" },
              { degree: "12th Standard", school: "LK Singhania Education Centre, Nagaur", period: "2021–2022", grade: "67%", icon: "📚" },
              { degree: "10th Standard", school: "LK Singhania Education Centre, Nagaur", period: "2019–2020", grade: "72%", icon: "📖" },
            ].map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass gradient-border rounded-2xl p-6 flex items-center gap-4"
              >
                <span className="text-3xl">{edu.icon}</span>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-white">{edu.degree}</h3>
                  <p className="text-[#94a3b8] text-sm">{edu.school}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-semibold">{edu.grade}</p>
                  <p className="text-xs text-[#94a3b8]">{edu.period}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 px-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              Get In <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-[#94a3b8]">Open to opportunities, collaborations, and interesting conversations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass gradient-border rounded-2xl p-8"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-sm text-[#94a3b8] mb-1 block">Message</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all resize-none" rows={4} placeholder="Your message..." />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white font-heading font-semibold hover:opacity-90 transition-all"
              >
                Send Message ✨
              </motion.button>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 glass gradient-border rounded-2xl p-6"
          >
            <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Certifications
            </h3>
            <div className="space-y-2">
              {[
                "Machine Learning — YBI Foundation",
                "Fundamentals of Generative AI — Microsoft",
              ].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {cert}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
