import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices, filterByCategory } from "../redux/slices/serviceSlice";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const FullServices = () => {
  const dispatch = useDispatch();
  const { services, filteredServices, categories } = useSelector((state) => state.services);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(filterByCategory(category));
    setActiveCategory(category);
  };

  const handleBookService = (service) => {
    console.log(`Booking service: ${service.name}`);
    navigate(`/dashboard/services/${service.id}`);

  };

  return (
    <div className="manage-services">
      <h2>Our Services</h2>
      <div className="category-list-wrapper">
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
      <div className="service-list">
        <ul className="service-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <li key={service.id} className="service-item">
                <div className="service-image">
                  {service.imageUrl && <img src={service.imageUrl} alt={service.name} />}
                </div>
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p>Price: Rs.{service.price}</p>
                  <p>Duration: {service.duration} minutes</p>
                  <button onClick={() => handleBookService(service)} className="service-button book">
                    Book
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No services found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FullServices;
