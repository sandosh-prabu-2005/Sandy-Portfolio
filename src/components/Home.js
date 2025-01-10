import React from "react";
import { FaDownload, FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import profileImage from "../Assets/sandy.jpg";
import "./Home.css";

const Home = () => {
  return (
    <section id="home" className="about-section">
      <div className="about-content">
        <div className="about-image">
          <div className="rotating-border">
            <img src={profileImage} alt="Sandosh Prabu - Web Developer" className="profile-img" />
          </div>
        </div>
        <div className="about-text">
          <h3>Hi, I'm Sandosh Prabu</h3>
          <p><strong>Web Developer | Game & App Developer</strong></p>
          <p>
            I specialize in crafting solutions that break down complex user experience challenges. With a focus on integrity and innovation, I create seamless web, app, and game experiences that connect people across the globe.
          </p>
          <div className="button-group">
            <div className="social-media-links">
            <a href="/path-to-your-cv.pdf" download className="download-cv">
              <FaDownload className="icon" /> Download CV
            </a>
              <a href="https://www.instagram.com/itz._.me._.sandy/?__pwa=1" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                <FaInstagram className="icon" />
              </a>
              <a href="https://www.linkedin.com/in/sandosh-prabu-ganesh-babhu-h14112008/" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                <FaLinkedin className="icon" />
              </a>
              <a href="https://github.com/sandosh-prabu-2005" target="_blank" rel="noopener noreferrer" className="social-btn github">
                <FaGithub className="icon" />
              </a>
              <a href="https://x.com/sandy_5_sandosh" target="_blank" rel="noopener noreferrer" className="social-btn twitter">
                <FaTwitter className="icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
