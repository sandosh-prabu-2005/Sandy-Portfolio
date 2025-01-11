import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import font awesome
import './Skills.css';
import htmlLogo from "../Assets/html.png";
import cssLogo from "../Assets/css3.webp";
import jsLogo from "../Assets/js.png";
import reactLogo from "../Assets/react.png";
import nodeLogo from "../Assets/nodejs.png";
import githubLogo from "../Assets/github.png";
import python from "../Assets/python.png";
import cLogo from "../Assets/c.webp";
import cppLogo from "../Assets/c++.png";
import javaLogo from "../Assets/java.png";

function Skills() {
  const skills = [
    { logo: htmlLogo, name: "HTML", level: "91%" },
    { logo: cssLogo, name: "CSS", level: "95%" },
    { logo: jsLogo, name: "JavaScript", level: "87%" },
    { logo: reactLogo, name: "React", level: "82%" },
    { logo: nodeLogo, name: "Node JS", level: "69%" },
    { logo: githubLogo, name: "GitHub", level: "89%" },
    { logo: cLogo, name: "C", level: "75%" },
    { logo: cppLogo, name: "C++", level: "70%" },
    { logo: python, name: "Python", level: "85%" },
    { logo: javaLogo, name: "Java", level: "92%" },
  ];

  return (
    <section id="skills" className="skills-section">
      <header className="skills-header">
        <h1><i className="fas fa-tools"></i> My Skills</h1>
        <p>
          <i className="fas fa-lightbulb"></i> We put your ideas and thus your wishes
          in the form of a unique web project that inspires you and your customers.
        </p>
      </header>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <div className="skill" key={index} style={{ '--skill-level': skill.level }}>
            <img src={skill.logo} alt={skill.name} className="skill-logo" />
            <span className="skill-name">{skill.name}</span>
            <div className="skill-bar">
              <div className="skill-fill"></div>
            </div>
            <span className="skill-percentage">{skill.level}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
