import Main from "./Main";
import Services from "./Services";
import About from "./About";
import Stylists from "./Stylists";
import Reviews from "./Reviews";
import './Dashboard.css';
const Dashboard =() => {
    return (
        <>
        <h1 className="main-heading">Salon Booking</h1>
          <Main />
          <Services />
          <About />
          <Stylists />
          <Reviews />
        </>
    );
}
export default Dashboard;