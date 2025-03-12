import React from "react";
import "../styles.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Salon Booking. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
