"use client";

import React from "react";
import { FiCheckCircle, FiAward, FiBookOpen, FiExternalLink } from "react-icons/fi";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const HIGHLIGHTS = [
  "Full Stack Developer",
  "AI/ML & SaaS Solutions Specialist",
  "Strategic Product Architect",
  "Smart India Hackathon 2024 Grand Finale Team Lead",
  "Innovation-Driven Technology Leader"
];

function HighlightCard({ text, delay }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative w-full glass-card teal-border p-4 flex items-center gap-4 transition-colors duration-300 rounded-2xl bg-slate-900/30 hover:bg-slate-800/50"
      >
        <div style={{ transform: "translateZ(30px)" }} className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          {text.includes("Hackathon") ? <FiAward className="text-lg" /> : <FiCheckCircle className="text-lg" />}
        </div>
        <p style={{ transform: "translateZ(20px)" }} className="text-slate-300 text-sm md:text-base font-medium group-hover:text-white transition-colors">
          {text}
        </p>
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-20 relative">
      
      {/* Background glow specific to about section */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="reveal mb-12">
        <p className="font-orb text-[10px] tracking-[0.3em] text-cyan-500/70 uppercase mb-2">◈ About Me</p>
        <h2 className="font-orb text-3xl md:text-4xl font-black text-white mb-3 tracking-wide">Vision & Leadership</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Text & Edu */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="reveal glass-card teal-border p-8 md:p-10 rounded-[2rem] bg-slate-950/40 shadow-2xl relative overflow-hidden">
            {/* Subtle inner corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-[30px]" />
            
            <h3 className="font-orb text-2xl md:text-3xl font-bold text-white mb-1">G. Sandosh Prabu</h3>
            <p className="font-space text-sm text-cyan-400 uppercase tracking-widest font-bold mb-6">Founder & CEO <span className="text-slate-500 font-normal lowercase tracking-normal mx-1">at</span> LATIVEX SOLUTIONS</p>
            
            <div className="space-y-5 text-slate-300 text-sm md:text-[15px] leading-relaxed">
              <p>
                Full Stack Developer specializing in <strong className="text-white font-medium">AI/ML systems, SaaS platforms, scalable software architecture</strong>, and modern digital ecosystems.
              </p>
              <p>
                As the Founder & CEO of <strong className="text-cyan-300 font-medium tracking-wider">LATIVEX SOLUTIONS</strong>, I lead the company's vision, product innovation, strategic development, and technology direction. My expertise focuses on building intelligent business systems, scalable platforms, AI-driven products, and future-ready digital experiences.
              </p>
            </div>

            <div className="mt-8 relative z-20">
              <a href="https://lativex-solutions.vercel.app" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-black tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-100 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 active:translate-y-0 font-orb uppercase">
                VISIT LATIVEX SOLUTIONS
                <FiExternalLink className="text-sm ml-1" />
              </a>
            </div>
          </div>

          <div className="reveal flex items-center gap-5 glass-card p-5 md:p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <FiBookOpen className="text-2xl text-cyan-500/70" />
            </div>
            <div>
              <h4 className="font-orb text-sm md:text-base font-bold text-white tracking-wide">Mepco Schlenk Engineering College</h4>
              <p className="text-slate-400 text-xs md:text-sm mt-1">Bachelor of Engineering <span className="mx-2 text-white/20">|</span> <span className="text-cyan-400/80 font-space tracking-widest">Batch 2023 - 2027</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Highlights */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h4 className="reveal font-orb text-sm text-white uppercase tracking-widest mb-2 flex items-center gap-3">
            <span className="w-8 h-px bg-cyan-500/50" /> Expertise
          </h4>
          
          <div className="flex flex-col gap-4 perspective-1000">
            {HIGHLIGHTS.map((item, i) => (
              <HighlightCard key={i} text={item} delay={i * 100} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
