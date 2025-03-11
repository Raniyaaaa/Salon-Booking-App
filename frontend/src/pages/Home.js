import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const Home = () => {
  return (
    <div className="container">
      <h1 className="title">Welcome to Our Salon</h1>
      <p className="subtitle">Book your appointment easily online!</p>
      <div className="button-group">
        <Link to="/register" className="btn btn-primary">Register</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  );
};

export default Home;
