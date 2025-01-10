import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import font awesome
import './Contact.css';

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames="contact-transition"
      >
        <div className="contact-page">
          <div className="contact-container">
            {/* Contact Form */}
            <form className="contact-form">
              <h1 className="contact-heading">Let’s work together!</h1>
              <p className="contact-subheading">
                I design and code beautifully simple things, and I love what I do. Just simple like that!
              </p>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" placeholder="Enter your Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" placeholder="Enter your Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Enter valid Email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="Enter your Phone Number" required />
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>

            {/* Contact Information */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p><i className="fas fa-phone-alt"></i> <strong> Phone:</strong><a href="https://api.whatsapp.com/send/?phone=9894660660&text&type=phone_number&app_absent=0"> +91 9894660660</a></p>
              <p><i className="fas fa-envelope"></i> <strong> Email-1:</strong> <a href="mailto:sandoshprabu50@gmail.com"> sandoshprabu50@gmail.com</a></p>
              <p><i className="fas fa-envelope"></i> <strong> Email-2:</strong><a href="mailto:sandoshprabu50@hotmail.com"> sandoshprabu50@hotmail.com</a></p>
              <p><i className="fas fa-map-marker-alt"></i> <strong> Address:</strong> <a href="https://www.google.com/maps/place/Krishna+Prabu+House/@9.4431009,77.794782,102m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3b06cee0ff7834a5:0x662b762921d5649!2s740,+Mundaga+Nadar+St,+Kaliappa+Nagar,+Sivakasi,+Tamil+Nadu+626123!3b1!8m2!3d9.4445224!4d77.7938787!3m5!1s0x3b06cf007e7540c7:0x8bb0e8ef442533f2!8m2!3d9.4432648!4d77.7951115!16s%2Fg%2F11lf8mgr06?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank">740, Mundaga Nadar St, Kaliappa Nagar, Sivakasi, Tamil Nadu 626123</a></p>
            </div>
          </div>
        </div>
      </CSSTransition>
    </section>
  );
}

export default Contact;
