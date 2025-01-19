import React from "react";
import "./Header.css";
import logo from "../Assets/splogo2.png"; // Ensure the correct path to your logo image

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <p className="email">sandoshprabu50@gmail.com</p>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#test">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
          <button><a href="mailTo:sandoshprabu50@gmail.com">Hire Me!</a></button>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
