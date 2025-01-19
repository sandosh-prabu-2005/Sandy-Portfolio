import React from "react";
import "./TestimonialsPage.css";
import jk from "../Assets/jk.jfif";
import jk2 from "../Assets/jk2.jpg";
import jk3 from "../Assets/jk3.jpg";

const testimonials = [
    {
        name: "JeyaRam ",
        role: "CEO, TechCorp",
        feedback:
            "Working with you was an absolute pleasure! Your attention to detail and commitment to excellence are remarkable.",
        image: jk,
    },
    {
        name: "Saravana Krishnan",
        role: "Senior Developer, CodeWorks",
        feedback:
            "Your expertise and problem-solving skills have significantly improved our team's efficiency. Thank you for your hard work!",
        image: jk2,
    },
    {
        name: "Sandhi",
        role: "Project Manager, Creative Agency",
        feedback:
            "You bring creativity and innovation to every project. I truly appreciate your collaborative approach and dedication.",
        image: jk3,
    },
];

const TestimonialsPage = () => {
    return (
        <section id="test" className="test-section">
            <div className="testimonials-page">
                <h1 className="testimonials-title">What Our Clients Say</h1>
                <div className="testimonials-container">
                    {testimonials.map((testimonial, index) => (
                        <div className="testimonial-card" key={index}>
                            <img
                                src={testimonial.image}
                                alt={`${testimonial.name}'s profile`}
                                className="testimonial-image"
                            />
                            <div className="testimonial-content">
                                <h3 className="testimonial-name">{testimonial.name}</h3>
                                <p className="testimonial-role">{testimonial.role}</p>
                                <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsPage;
