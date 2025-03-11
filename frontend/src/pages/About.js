import './Dashboard.css';

const About = () => {
    return (
      <div className="about-container">
        {/* Left Column - Text */}
        <div className="about-image">
          <img src="https://i.pinimg.com/736x/f4/5c/36/f45c3603aaf44bf6c97ea64ae0f64c46.jpg" 
               alt="Salon Interior" />
        </div>
        
        {/* Right Column - Image */}
        <div className="about-text">
          <h2>About Our Salon</h2>
          <p>We are passionate about providing the best salon experience.</p>
        </div>
      </div>
    );
};

export default About;
