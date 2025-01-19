import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Skills from "./components/Skills";
import TestimonialsPage from "./components/TestimonialsPage";

function App() {
  const [showScroll, setShowScroll] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalDocScrollLength = docHeight - winHeight;
      const scrollPosition = Math.floor((scrollTop / totalDocScrollLength) * 100);

      setScrollPercentage(scrollPosition);
      setShowScroll(scrollTop > 300);

      // Rotate the background circle based on the scroll position
      const rotationDegree = scrollTop * 0.1; // Adjust the multiplier for speed

      const circleBackground = document.querySelector('.circle-background');
      if (circleBackground) {
        circleBackground.style.transform = `rotate(${rotationDegree}deg)`;
      }

      const circleForeground = document.querySelector('.circle-foreground');
      if (circleForeground) {
        circleForeground.style.transform = `rotate(${rotationDegree * -1}deg)`; // Reverse the foreground rotation
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Header />
      <Home />
      <main>
        <Projects />
        <Skills />
        <TestimonialsPage />
        <Contact />
      </main>
      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          style={{
            background: `conic-gradient(#feb47b 0% ${(100 - scrollPercentage)}%, #000 ${(100 - scrollPercentage)}% 100%)`,
          }}
        >
          <div className="circle-wrapper">
            <div className="circle-background"></div>
            <div className="circle-foreground"></div>
          </div>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="scroll-icon"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M348.3 216.4c-5 5.1-13.3 5.1-18.4.1L269 155.8v231.3c0 7.1-5.8 12.9-13 12.9s-13-5.8-13-12.9V155.8l-60.9 60.8c-5.1 5-13.3 4.9-18.4-.1-5-5.1-5-13.2.1-18.3l83-82.4c1.2-1.1 2.5-2 4.1-2.7 1.6-.7 3.3-1 5-1 3.4 0 6.6 1.3 9.1 3.7l83 82.4c5.2 4.9 5.3 13.1.3 18.2z"></path>
          </svg>
          <span className="scroll-percentage">{scrollPercentage}%</span>
        </button>
      )}
    </div>
  );
}

export default App;
