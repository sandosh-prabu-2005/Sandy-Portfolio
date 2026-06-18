"use client";

import React, { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const INFO = [
  { icon: <FiPhone />, lbl: "Phone", val: "+91 9894660660", href: "https://api.whatsapp.com/send/?phone=9894660660&text&type=phone_number&app_absent=0" },
  { icon: <FiMail />, lbl: "Email", val: "sandoshprabu50@gmail.com", href: "mailto:sandoshprabu50@gmail.com" },
  { icon: <FiMail />, lbl: "Email", val: "sandoshprabu50@hotmail.com", href: "mailto:sandoshprabu50@hotmail.com" },
  { icon: <FiMapPin />, lbl: "Address", val: "6/666 K.S.A Rajadurai Nagar, 20th St, Sivakasi - 626124, Tamil Nadu, India", href: "https://www.google.com/maps/place/Krishna+Prabu+House/@9.4431009,77.794782" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  // Framer Motion 3D Tilt Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movements
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation angle (max 8 degrees for a subtle, premium feel)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
    // Reset to center smoothly when mouse leaves
    x.set(0);
    y.set(0);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="py-5 relative">
      <div className="reveal text-center mb-12">
        <p className="font-orb text-[10px] tracking-[0.3em] text-teal-500/70 uppercase mb-1">◈ Connect</p>
        <h2 className="font-orb text-3xl md:text-4xl font-black text-white mb-2">Initiate Comms</h2>
        <p className="text-slate-300 text-xs font-medium">Let's build the next big thing together.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4" style={{ perspective: "1500px" }}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative reveal glass-card teal-border rounded-3xl p-1 lg:p-2 shadow-2xl transition-colors duration-300"
        >
          {/* Inner container to hold the unified layout */}
          <div
            className="flex flex-col lg:flex-row gap-8 lg:gap-16 p-8 lg:p-12 bg-slate-950/30 rounded-[1.25rem] overflow-hidden"
            style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          >
            {/* Left: Info Blocks */}
            <div
              className="flex-1 flex flex-col justify-center gap-8 relative z-10"
              style={{ transform: "translateZ(60px)" }}
            >
              {INFO.map(({ icon, lbl, val, href }) => (
                <div key={val} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 shadow-lg shadow-teal-500/5 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                    <span className="text-xl">{icon}</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-orb text-[10px] text-teal-500/80 uppercase tracking-[0.2em] mb-1">{lbl}</p>
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="text-slate-200 text-sm font-space hover:text-teal-400 transition-colors leading-tight block max-w-[280px]">
                      {val}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Form */}
            <form
              onSubmit={onSubmit}
              className="flex-[1.3] flex flex-col gap-8 relative z-10"
              style={{ transform: "translateZ(70px)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {[
                  { id: "fname", lbl: "First Name", type: "text", col: "" },
                  { id: "lname", lbl: "Last Name", type: "text", col: "" },
                  { id: "email", lbl: "Email", type: "email", col: "sm:col-span-2" },
                ].map(({ id, lbl, type, col }) => (
                  <div key={id} className={`relative group ${col}`}>
                    <input
                      id={id}
                      required
                      type={type}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white font-space 
                                 focus:outline-none focus:border-teal-400 transition-all"
                    />
                    <label
                      htmlFor={id}
                      className="absolute left-0 -top-4 text-teal-400 font-orb text-[9px] uppercase tracking-[0.1em] transition-all duration-300
                                 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-[11px]
                                 peer-focus:-top-4 peer-focus:text-teal-400 peer-focus:text-[9px] pointer-events-none"
                    >
                      {lbl}
                    </label>
                  </div>
                ))}

                <div className="relative group sm:col-span-2 mt-2">
                  <textarea
                    id="msg"
                    required
                    rows={3}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-white/20 px-0 py-2.5 text-sm text-white font-space resize-none
                               focus:outline-none focus:border-teal-400 transition-all"
                  />
                  <label
                    htmlFor="msg"
                    className="absolute left-0 -top-4 text-teal-400 font-orb text-[9px] uppercase tracking-[0.1em] transition-all duration-300
                               peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-[11px]
                               peer-focus:-top-4 peer-focus:text-teal-400 peer-focus:text-[9px] pointer-events-none"
                  >
                    Message
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-3 py-3.5 rounded-lg bg-teal-gradient text-slate-950
                           text-xs font-black font-orb tracking-widest uppercase shadow-[0_0_20px_rgba(34,211,238,0.3)]
                           hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                style={{ transform: "translateZ(30px)" }}
              >
                {sent ? "✓ Transmitted" : <><FiSend className="text-sm" /> Send Transmission</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
