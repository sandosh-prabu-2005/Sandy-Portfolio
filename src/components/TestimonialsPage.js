"use client";

import React from "react";
import { RiDoubleQuotesL } from "react-icons/ri";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import ImgWinner from "../Assets/winner.png";
import ImgLuckyStar from "../Assets/luckystar.png";
import ImgCKBilling from "../Assets/ckbilling.png";

const REVIEWS = [
  { name: "Winner Weaving Mills", role: "Manufacturer in Sivakasi", feedback: "Lativex Solutions delivered an outstanding corporate website. Our digital presence has significantly improved, bringing a highly professional and premium experience to our manufacturing business.", img: ImgWinner },
  { name: "Lucky Star Agencies", role: "Fireworks Store, TN", feedback: "Quality is Our Motto. Their expertise in e-commerce transformed our business. The custom platform they built handles our wholesale fireworks orders flawlessly, running 24/7 with perfect reliability.", img: ImgLuckyStar },
  { name: "CK Fine Arts", role: "Billing & Operations", feedback: "The modern billing platform they designed completely streamlined our operations. It significantly improved our accuracy and enhanced productivity through intuitive, automation-focused workflows.", img: ImgCKBilling },
];

function Testimonial3DCard({ r }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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
    <div style={{ perspective: "1200px" }} className="w-full h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative w-full h-full glass-card teal-border p-6 md:p-8 flex flex-col items-center text-center shadow-xl transition-colors duration-300 rounded-3xl"
      >
        <RiDoubleQuotesL
          className="text-teal-500/30 text-4xl mb-4 transition-transform duration-300 group-hover:text-teal-400"
          style={{ transform: "translateZ(30px)" }}
        />

        <div
          className="w-16 h-16 rounded-full overflow-hidden bg-white ring-2 ring-teal-500/30 mb-4 shadow-lg transition-all duration-500 group-hover:ring-teal-400 group-hover:shadow-teal-500/20 flex items-center justify-center"
          style={{ transform: "translateZ(60px)" }}
        >
          <img src={r.img.src ?? r.img} alt={r.name} className="w-full h-full object-contain p-1.5 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
        </div>

        <p
          className="text-slate-300 text-[13px] leading-relaxed italic mb-5"
          style={{ transform: "translateZ(40px)" }}
        >
          "{r.feedback}"
        </p>

        <div style={{ transform: "translateZ(50px)" }}>
          <h4 className="font-orb text-sm font-bold text-white tracking-wide">{r.name}</h4>
          <p className="font-space text-[10px] text-teal-400 mt-1 uppercase tracking-widest">{r.role}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <section id="test" className="py-5 relative">
      <div className="reveal text-center mb-12">
        <p className="font-orb text-[10px] tracking-[0.3em] text-teal-500/70 uppercase mb-1">◈ Testimonials</p>
        <h2 className="font-orb text-3xl md:text-4xl font-black text-white mb-2">Client Feedback</h2>
        <p className="text-slate-300 text-xs font-medium">What they say about the experience.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((r, i) => (
            <Testimonial3DCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
