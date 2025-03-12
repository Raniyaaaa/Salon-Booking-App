import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStylists } from "../redux/slices/stylistSlice";
import "./ManageStylists.css";

const Stylists = () => {
  const dispatch = useDispatch();
  const { stylists, loading, error } = useSelector((state) => state.stylists);

  useEffect(() => {
    dispatch(fetchStylists());
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="title">Meet Our Stylists</h2>

      {loading && <p className="loading">Loading stylists...</p>}
      {error && <p className="error">{error}</p>}

      <div className="stylist-grid">
        {stylists.length === 0 ? (
          <p>No stylists available.</p>
        ) : (
          stylists.map((stylist) => (
            <div key={stylist.id} className="stylist-card">
              <h3>{stylist.name}</h3>
              <p>Specialization: {Array.isArray(stylist.specialization) ? stylist.specialization.join(", ") : stylist.specialization || "None"}</p>
              <img
                src={stylist.imageUrl || "https://via.placeholder.com/100"}
                alt={stylist.name}
                className="stylist-image"
              />
              <p className={`availability-button ${stylist.availability ? "available" : "not-available"}`}>
                {stylist.availability ? "Available" : "Not Available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Stylists;
