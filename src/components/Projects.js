"use client";

import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

import BostamiImage  from "../Assets/Bostami.png";
import GuesstheLogo  from "../Assets/GuesstheLogo.png";
import hangman       from "../Assets/hangman.png";
import PersonalImage from "../Assets/PersonalImage.png";
import Add2Cart      from "../Assets/add2cart.jpg";

const PROJECTS = [
  { category: "E-commerce", name: "Mobile Cart",       desc: "Fashion e-commerce dark-theme template",         link: "https://mob-cart.vercel.app/",             img: Add2Cart      },
  { category: "Portfolio",  name: "Sandy's Portfolio", desc: "Personal portfolio — React.js",                  link: "https://sandy-portfolio-beta.vercel.app/", img: PersonalImage },
  { category: "Portfolio",  name: "Bostami",           desc: "HTML & CSS portfolio template",                  link: "https://portfolio-sandy2005.vercel.app/",  img: BostamiImage  },
  { category: "Tasks",      name: "Guess the Logo",    desc: "Interactive logo-guessing game in JS",           link: "https://guess-the-logo-rouge.vercel.app/", img: GuesstheLogo  },
  { category: "Tasks",      name: "Hang Man",          desc: "Classic Hangman word-game in JS",               link: "https://hang-man-iota.vercel.app/",        img: hangman       },
];
const CATS = ["All", "Portfolio", "E-commerce", "Tasks"];

function Project3DCard({ p }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{ perspective: "1200px" }}
      className="w-full h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full glass-card teal-border overflow-hidden shadow-2xl transition-colors duration-300 rounded-[2rem] flex flex-col bg-slate-950/40"
      >
        {/* Image */}
        <div className="relative overflow-hidden w-full h-52 shrink-0" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          <img src={p.img.src ?? p.img} alt={p.name}
               className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
          
          <span 
            className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] font-orb font-bold tracking-widest
                       bg-slate-950/80 border border-teal-500/40 text-teal-400 backdrop-blur-md uppercase shadow-lg shadow-teal-500/20"
            style={{ transform: "translateZ(40px)" }}
          >
            {p.category}
          </span>
        </div>
        
        {/* Body */}
        <div className="p-7 flex-1 flex flex-col" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
          <h3 className="font-orb text-lg md:text-xl font-bold text-white mb-2 tracking-wide group-hover:text-teal-300 transition-colors">{p.name}</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
          
          <a href={p.link} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-[11px] font-bold text-teal-400 hover:text-teal-300 transition-colors group/link mt-auto uppercase tracking-wider w-fit"
             style={{ transform: "translateZ(20px)" }}
          >
            Deploy Uplink
            <FiExternalLink className="text-sm transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
          </a>
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-[4px] w-0 group-hover:w-full bg-teal-gradient transition-all duration-700 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [sel, setSel] = useState("All");

  const items = sel === "All" ? PROJECTS : PROJECTS.filter(p => p.category === sel);

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        
        {/* Header aligned left, utilizing space properly */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <p className="font-orb text-[10px] tracking-[0.3em] text-teal-500/70 uppercase mb-2">◈ Portfolio</p>
            <h2 className="font-orb text-3xl md:text-4xl font-black text-white mb-3">Recent Works</h2>
            <p className="text-slate-300 text-sm font-medium">Turning ideas into unique digital products that inspire.</p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-3">
            {CATS.map((cat) => {
              const active = cat === sel;
              return (
                <button key={cat} onClick={() => setSel(cat)}
                  className={`relative flex items-center justify-center px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500
                    ${active ? "text-teal-300 bg-teal-500/10 border border-teal-400/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                             : "text-slate-400 bg-white/5 border border-white/5 hover:border-white/20 hover:text-slate-200 hover:bg-white/10 backdrop-blur-sm"}`}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid utilizing space with AnimatePresence for smooth layout transitions */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <Project3DCard key={p.name} p={p} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {items.length === 0 && (
          <div className="w-full py-20 text-center text-slate-500 font-orb tracking-widest uppercase">
            No transmissions found in this sector.
          </div>
        )}

      </div>
    </section>
  );
}
