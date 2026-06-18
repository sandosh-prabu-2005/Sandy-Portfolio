"use client";

import React from "react";
import htmlLogo   from "../Assets/html.png";
import cssLogo    from "../Assets/css3.webp";
import jsLogo     from "../Assets/js.png";
import reactLogo  from "../Assets/react.png";
import nodeLogo   from "../Assets/nodejs.png";
import githubLogo from "../Assets/github.png";
import pythonLogo from "../Assets/python.png";
import cLogo      from "../Assets/c.webp";
import cppLogo    from "../Assets/c++.png";
import javaLogo   from "../Assets/java.png";

const SKILLS = [
  { logo: htmlLogo,   name: "HTML",       level: "91%" },
  { logo: cssLogo,    name: "CSS",        level: "95%" },
  { logo: jsLogo,     name: "JavaScript", level: "87%" },
  { logo: reactLogo,  name: "React",      level: "82%" },
  { logo: nodeLogo,   name: "Node JS",    level: "69%" },
  { logo: githubLogo, name: "GitHub",     level: "89%" },
  { logo: cLogo,      name: "C",          level: "75%" },
  { logo: cppLogo,    name: "C++",        level: "70%" },
  { logo: pythonLogo, name: "Python",     level: "85%" },
  { logo: javaLogo,   name: "Java",       level: "92%" },
];

export default function Skills() {
  return (
    <section id="skills" className="py-8">
      <div className="reveal">
        <p className="font-orb text-[10px] tracking-[0.3em] text-teal-500/70 uppercase mb-1">◈ Expertise</p>
        <h2 className="font-orb text-2xl md:text-3xl font-bold text-white mb-1">My Skills</h2>
        <p className="text-slate-400 text-xs mb-7 max-w-sm">Technologies I use to build polished, scalable products.</p>
      </div>

      <div className="reveal-stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {SKILLS.map((sk, i) => (
          <div key={i}
               className="skill group glass-card teal-border p-4 flex flex-col items-center text-center
                          hover:-translate-y-1 hover:shadow-teal-sm transition-all duration-300 cursor-default"
               style={{ "--skill-level": sk.level }}>
            <img src={sk.logo.src ?? sk.logo} alt={sk.name}
                 className="w-9 h-9 object-contain mb-2.5 grayscale-[55%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300" />
            <span className="font-orb text-xs font-semibold text-white mb-2.5 tracking-wider">{sk.name}</span>
            <div className="relative w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="skill-fill" />
            </div>
            <span className="mt-1.5 text-[9px] font-orb font-medium text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {sk.level}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
