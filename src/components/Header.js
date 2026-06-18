"use client";

import React, { useState, useEffect } from "react";
import { FiMail, FiMenu, FiX } from "react-icons/fi";
import logo from "../Assets/splogo2.png";

export default function Header({ activeIdx = 0, sections = [], onNav }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = sections.length
    ? sections
    : [
        { id: "home",     label: "Home" },
        { id: "projects", label: "Projects" },
        { id: "skills",   label: "Skills" },
        { id: "test",     label: "Testimonials" },
        { id: "contact",  label: "Contact" },
      ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300
      ${scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.6)]"
                 : "bg-transparent border-b border-transparent"}`}
    >
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); onNav?.("home"); }} className="shrink-0 flex items-center gap-3 group">
          <img src={logo.src ?? logo} alt="SP" className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
          <span className="hidden sm:block font-orb text-xl md:text-2xl font-bold tracking-[0.2em] text-cyan-400 uppercase">
            Sandy<span className="text-white/30">.</span>dev
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map((s, i) => (
            <button key={s.id}
              onClick={() => onNav?.(s.id)}
              className={`relative px-3 py-2 text-sm font-semibold transition-colors duration-200 rounded
                ${i === activeIdx ? "text-cyan-400" : "text-slate-300 hover:text-white"}`}
            >
              {s.label}
              {i === activeIdx && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full bg-cyan-400" />
              )}
            </button>
          ))}
          <a href="mailto:sandoshprabu50@gmail.com"
             className="ml-4 px-6 py-2.5 rounded-full text-xs font-black text-slate-950
                        bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] 
                        hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all duration-200 font-orb tracking-widest uppercase whitespace-nowrap">
            HIRE ME
          </a>
        </nav>

        {/* Mobile */}
        <button className="lg:hidden text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/[0.06] px-5 pb-5 pt-3 flex flex-col gap-2">
          {navItems.map((s) => (
            <button key={s.id}
              onClick={() => { onNav?.(s.id); setMobileOpen(false); }}
              className="py-3 text-lg text-slate-300 hover:text-cyan-400 text-left transition-colors font-semibold">
              {s.label}
            </button>
          ))}
          <a href="mailto:sandoshprabu50@gmail.com"
             className="mt-4 py-3.5 rounded-full text-base font-black text-slate-950 bg-cyan-400 text-center font-orb tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            HIRE ME
          </a>
        </div>
      )}
    </header>
  );
}
