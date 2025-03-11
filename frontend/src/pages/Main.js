import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>You Deserves the Best</h1>
        <p>Book an appointment in 3 simple steps.</p>
        <button className="book-btn" onClick={() => { navigate('/dashboard/services')}}>Book Now</button>
      </div>
    </div>
  );
};

export default Main;
