"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { FiArrowUp, FiChevronDown } from "react-icons/fi";
import { useReveal } from "../hooks/useReveal";

import Header from "../components/Header";
import Home from "../components/Home";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Testimonials from "../components/TestimonialsPage";
import Contact from "../components/Contact";
import About from "../components/About";

const AntigravityScene = dynamic(() => import("../components/AntigravityScene"), { ssr: false });

// Section config — drives the storytelling progress indicator
const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "test", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

// Directional slide variants — mirrors PortfolioOverlay.tsx pattern
const slideVariants = {
  initial: (dir) => ({
    opacity: 0,
    y: dir > 0 ? 60 : -60,
    filter: "blur(6px)",
  }),
  animate: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: {
      y: { type: "spring", stiffness: 110, damping: 20 },
      opacity: { duration: 0.5, ease: "easeOut" },
      filter: { duration: 0.4 },
    },
  },
  exit: (dir) => ({
    opacity: 0,
    y: dir > 0 ? -60 : 60,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: "easeInOut" },
  }),
};

export default function Page() {
  const containerRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  // Framer-motion scroll progress on the full page
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Wire up CSS slide-up reveal for individual elements
  useReveal(0.12);

  // Track which section is active for the storytelling indicator
  useMotionValueEvent(smooth, "change", (v) => {
    setScrollPct(Math.round(v * 100));
    setShowScroll(v > 0.04);

    let idx = 0;
    if (v < 0.15) idx = 0;
    else if (v < 0.32) idx = 1;
    else if (v < 0.50) idx = 2;
    else if (v < 0.68) idx = 3;
    else if (v < 0.85) idx = 4;
    else idx = 5;

    if (idx !== activeIdx) {
      setDirection(idx > activeIdx ? 1 : -1);
      setActiveIdx(idx);
    }
  });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* 🌌 Antigravity 3D Background */}
      <AntigravityScene scrollYProgress={smooth} />

      {/* ── Content layer ───────────────────────────────────── */}
      <div className="relative z-10">
        <Header activeIdx={activeIdx} sections={SECTIONS} onNav={scrollToSection} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Home />
          <About />
          <Projects />
          <Skills />
          <Testimonials />
          <Contact />
        </div>

        {/* Footer */}
        <footer className="py-5 text-center text-slate-400 text-xs border-t border-white/[0.04] font-space tracking-widest uppercase">
          © {new Date().getFullYear()} &nbsp; Sandosh Prabu &nbsp; · &nbsp; All rights reserved
        </footer>
      </div>

      {/* ── Left-side storytelling indicator ───────────────── */}
      <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-3">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIdx}
            custom={direction}
            variants={slideVariants}
            initial="initial" animate="animate" exit="exit"
            className="writing-vertical text-[9px] font-orb tracking-[0.3em] text-teal-500/70 uppercase mb-1"
            style={{ writingMode: "vertical-rl" }}
          >
            {SECTIONS[activeIdx].label}
          </motion.div>
        </AnimatePresence>

        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            aria-label={`Go to ${s.label}`}
            className={`w-1.5 rounded-full transition-all duration-300
              ${i === activeIdx
                ? "h-6 bg-teal-400 shadow-teal-sm"
                : "h-1.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}

        {/* Progress bar */}
        <div className="mt-2 w-px h-16 bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            style={{ scaleY: smooth, originY: 0 }}
            className="absolute inset-0 bg-teal-gradient rounded-full"
          />
        </div>
      </div>

      {/* ── Scroll-to-top ────────────────────────────────────── */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex flex-col items-center justify-center gap-0.5
                       bg-slate-900/80 border border-teal-500/40 shadow-teal-sm backdrop-blur-md
                       text-teal-400 hover:text-teal-300 hover:border-teal-400/60 hover:shadow-teal-md
                       transition-colors duration-200 group"
          >
            <FiArrowUp className="text-sm group-hover:-translate-y-0.5 transition-transform duration-150" />
            <span className="text-[8px] font-orb leading-none">{scrollPct}%</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
