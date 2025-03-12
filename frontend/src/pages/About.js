import './Dashboard.css';

const About = () => {
    return (
      <div className="about-container">

        <div className="about-image">
          <img src="https://i.pinimg.com/736x/f4/5c/36/f45c3603aaf44bf6c97ea64ae0f64c46.jpg" 
               alt="Salon Interior" />
        </div>

        <div className="about-text">
          <h2>About Our Salon</h2>
          <div class="salon-description">
  <p>
    We are committed to delivering an <strong>unparalleled salon experience</strong> that 
    combines <em>luxury, comfort, and expert care</em>. Our skilled stylists and beauty 
    professionals take pride in offering personalized services tailored to your unique needs. 
    Whether it's a precision haircut, a rejuvenating facial, or a complete makeover, we ensure 
    that every visit leaves you feeling confident, refreshed, and beautifully you.
  </p>
</div>
        </div>
      </div>
    );
};

export default About;
