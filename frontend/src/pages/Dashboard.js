import Main from "./Main";
import Services from "./Services";
import About from "./About";
import Stylists from "./Stylists";
import Reviews from "./Reviews";
import './Dashboard.css';
const Dashboard =() => {
    return (
        <div className="main">
        <h1 className="main-heading">Salon Booking</h1>
          <Main />
          <Services />
          <About />
          <Stylists />
          <Reviews />
        </div>
    );
}
export default Dashboard;