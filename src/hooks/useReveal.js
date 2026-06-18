"use client";

import { useEffect } from "react";

/**
 * useReveal — attaches a single IntersectionObserver to every
 * element with the class 'reveal' or 'reveal-stagger'.
 * When the element enters the viewport it receives the class 'visible',
 * which triggers the CSS slide-up + fade transition defined in globals.css.
 */
export function useReveal(threshold = 0.15) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-stagger");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [threshold]);
}
