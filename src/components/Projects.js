import React, { useState } from "react";
import "./Project.css";
import BostamiImage from "../Assets/Bostami.png";
import GuesstheLogo from "../Assets/GuesstheLogo.png";
import hangman from "../Assets/hangman.png";
import PersonalImage from "../Assets/PersonalImage.png";

const projects = [
  {
    category: "E-commerce",
    name: "Nest",
    description: "Nest is the site about vegetables and groceries shopping",
    link: "https://example.com/nest",
    image: "https://via.placeholder.com/300x200?text=Nest+E-commerce",
  },
  {
    category: "E-commerce",
    name: "Fashion",
    description: "Fashion E-commerce Template Dark Theme",
    link: "https://example.com/fashion",
    image: "https://via.placeholder.com/300x200?text=Fashion+E-commerce",
  },
  {
    category: "Portfolio",
    name: "Sandy's Portfolio",
    description: "Personal Portfolio template ReactJs",
    link: "https://portfolio-sandy2005.vercel.app/",
    image: PersonalImage, 
  },
  {
    category: "Portfolio",
    name: "Bostami",
    description: "Personal Portfolio template HTML & CSS",
    link: "https://portfolio-sandy2005.vercel.app/",
    image: BostamiImage, 
  },
  {
    category: "Tasks",
    name: "Guess the Logo",
    description: "Simple Game task using JS",
    link: "https://guess-the-logo-rouge.vercel.app/",
    image: GuesstheLogo,
  },
  {
    category: "Tasks",
    name: "Hang Man",
    description: "Simple Game task using JS",
    link: "https://hang-man-iota.vercel.app/",
    image: hangman,
  },
];

const categories = ["All", "Portfolio", "E-commerce", "Tasks"];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [animationClass, setAnimationClass] = useState("pop-in");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setAnimationClass("pop-out"); // Start pop-out animation
    setTimeout(() => {
      setSelectedCategory(category);
      setAnimationClass("pop-in"); // Trigger pop-in animation after state update
    }, 300); // Match animation duration
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <header className="projects-header">
          <h1>
            <i className="fas fa-folder-open"></i> My Recent Works
          </h1>
          <p>
            <i className="fas fa-lightbulb"></i> We put your ideas and thus your
            wishes in the form of a unique web project that inspires you and
            your customers.
          </p>
        </header>

        <nav className="categories-toggle">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-btn ${selectedCategory === category ? "active" : ""
                }`}
            >
              <i
                className={
                  selectedCategory === category
                    ? "fas fa-check-circle"
                    : "far fa-circle"
                }
              ></i>{" "}
              {category}
            </button>
          ))}
        </nav>

        <main className={`projects-list ${animationClass}`}>
          {filteredProjects.map((project) => (
            <div key={project.name} className="project-card">
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="project-image"
              />
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Project
                </a>
              </div>
            </div>
          ))}
        </main>

      </div>
    </section>
  );
};

export default Projects;
