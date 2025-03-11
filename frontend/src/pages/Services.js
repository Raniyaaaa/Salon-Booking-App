import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServices,
  filterByCategory,
} from "../redux/slices/serviceSlice";

const Services = () => {
  const dispatch = useDispatch();
  const { filteredServices, categories } = useSelector((state) => state.services);

  const [showAll, setShowAll] = useState(false); // ✅ State to toggle services list
  const [activeCategory, setActiveCategory] = useState("All"); // ✅ Track active category

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(filterByCategory(category));
    setActiveCategory(category); // ✅ Update active category
  };

  const visibleServices = showAll ? filteredServices : filteredServices.slice(0, 8); // ✅ Show only 8 initially

  return (
    <div className="services">
      <h2>Our Services</h2>

      {/* Category Filter */}
      <div className='category-list-wrapper'>
        <div className="category-list">
          <button 
            onClick={() => handleCategoryClick("All")} 
            className={`category-button ${activeCategory === "All" ? "active" : ""}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button 
              key={category} 
              onClick={() => handleCategoryClick(category)} 
              className={`category-button ${activeCategory === category ? "active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleServices.length > 0 ? (
              visibleServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>Rs.{service.price}</td>
                  <td>
                    <button className="book-btn">Book Now</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No services available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show More / Show Less Button */}
      {filteredServices.length > 8 && (
        <div className="show-more-container">
          <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
