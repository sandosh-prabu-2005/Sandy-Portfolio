"use client";

import React from "react";
import { FiDownload, FiInstagram, FiLinkedin, FiGithub, FiTwitter } from "react-icons/fi";
import profileImage from "../Assets/sandy.jpg";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/itz._.me._.sandy/?__pwa=1", icon: <FiInstagram />, ring: "hover:ring-cyan-500/50 hover:text-cyan-400" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sandosh-prabu-ganesh-babhu-h14112008/", icon: <FiLinkedin />, ring: "hover:ring-cyan-500/50 hover:text-cyan-400" },
  { label: "GitHub", href: "https://github.com/sandosh-prabu-2005", icon: <FiGithub />, ring: "hover:ring-cyan-500/50 hover:text-cyan-400" },
  { label: "Twitter/X", href: "https://x.com/sandy_5_sandosh", icon: <FiTwitter />, ring: "hover:ring-cyan-500/50 hover:text-cyan-400" },
];

import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { delay: 0.5, staggerChildren: 0.08 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, display: "inline-block" },
  visible: { opacity: 1, display: "inline-block" },
};

export default function Home() {
  const name = "Sandosh Prabu";

  return (
    <section id="home" className="flex items-center min-h-[calc(100vh-4rem)] py-14">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 w-full relative">

        {/* Ambient background particles/blobs for glass effect */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30rem] h-[30rem] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Portrait */}
        <div className="shrink-0 reveal z-10">
          <div className="relative animate-float">
            {/* Octagon Glass Card wrapper */}
            <div className="relative w-56 h-56 md:w-64 md:h-64 lg:w-[22rem] lg:h-[22rem] glass-card p-2 ring-1 ring-white/10"
              style={{ clipPath: "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)", backgroundColor: "rgba(255,255,255,0.02)" }}>
              <img src={profileImage.src ?? profileImage} alt="Sandosh Prabu"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ clipPath: "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)" }} />
            </div>
            {/* Accent dots */}
            <div className="absolute top-0 right-8 w-2 h-2 rounded-sm bg-cyan-400/80 animate-glow-pulse" />
            <div className="absolute bottom-8 -left-4 w-2 h-2 rounded-sm bg-teal-500/80 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 max-w-2xl text-center md:text-left z-10">
          <div className="reveal">
            <p className="font-orb text-[11px] tracking-[0.4em] text-cyan-500/80 uppercase mb-4 flex items-center justify-center md:justify-start gap-3">
              <span className="text-cyan-500/50 text-[8px]">◈</span> PORTFOLIO <span className="text-cyan-500/50 text-[8px]">◈</span>
            </p>
            <motion.h1
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-orb text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-3 tracking-wide"
            >
              {name.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="font-space text-sm lg:text-base font-semibold text-cyan-400 tracking-wide mb-6">
              Web<span className="text-cyan-500/50 px-1">&</span>App Developer</p>
          </div>

          <p className="reveal text-slate-200 text-sm lg:text-[15px] leading-relaxed mb-8 max-w-lg">
            I specialise in crafting solutions that break down complex user-experience challenges.
            <span className="text-slate-400"> Focused on integrity and innovation — building seamless web, app, and
              game experiences that connect people across the globe.</span>
          </p>

          <div className="reveal flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <a href="/Sandosh_Prabu_Infosys%20(2Page).pdf" download="Sandosh_Prabu_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-400
                          text-slate-950 text-xs font-black tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)]
                          hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:bg-cyan-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-orb uppercase">
              <FiDownload className="text-base" /> DOWNLOAD CV
            </a>

            {socials.map(({ label, href, icon, ring }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm text-slate-400
                             ring-1 ring-white/10 bg-slate-900/40 backdrop-blur-md
                             transition-all duration-200 hover:scale-110 ${ring}`}>
                {icon}
              </a>
            ))}
          </div>

          {/* Quick stats strip */}
          <div className="reveal mt-12 flex gap-8 justify-center md:justify-start">
            {[["4+", "YEARS EXP."], ["15+", "PROJECTS"], ["10+", "TECH STACK"]].map(([num, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="font-orb text-2xl lg:text-3xl font-black text-cyan-400 tracking-wide">{num}</p>
                <p className="font-space text-[9px] lg:text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
