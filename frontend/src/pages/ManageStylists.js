import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStylists,
  addNewStylist,
  updateStylist,
  deleteStylist,
} from "../redux/slices/stylistSlice";
import { fetchServices } from "../redux/slices/serviceSlice";
import "./ManageStylists.css"; // Import CSS file

const ManageStylists = () => {
  const dispatch = useDispatch();
  const { stylists, loading, error } = useSelector((state) => state.stylists);
  const { categories, serviceLoading } = useSelector((state) => state.services);

  const [newStylist, setNewStylist] = useState({
    name: "",
    specialization: [],
    imageUrl: "",
    availability: true,
  });

  const [editingStylist, setEditingStylist] = useState(null);

  useEffect(() => {
    dispatch(fetchStylists());
    dispatch(fetchServices());
  }, [dispatch]);

  const handleAddOrUpdateStylist = () => {
    if (!newStylist.name.trim() || newStylist.specialization.length === 0) {
      alert("Please enter stylist name and select at least one specialization.");
      return;
    }

    if (editingStylist) {
      dispatch(updateStylist({ id: editingStylist.id, ...newStylist }));
      setEditingStylist(null);
    } else {
      dispatch(addNewStylist(newStylist));
    }

    setNewStylist({ name: "", specialization: [], imageUrl: "", availability: true });
  };

  const handleSpecializationChange = (event) => {
    const { value } = event.target;
    setNewStylist((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(value)
        ? prev.specialization.filter((spec) => spec !== value)
        : [...prev.specialization, value],
    }));
  };

  const handleEditStylist = (stylist) => {
    setNewStylist({
      name: stylist.name,
      specialization: stylist.specialization,
      imageUrl: stylist.imageUrl,
      availability: stylist.availability,
    });
    setEditingStylist(stylist);
  };

  return (
    <div className="container">
      <h2 className="title">Manage Stylists</h2>

      {/* Add/Edit Stylist Form */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Name"
          value={newStylist.name}
          onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })}
          className="input-field"
        />

        <label>Specialization:</label>
        <div className="checkbox-container">
          {serviceLoading ? (
            <p>Loading specializations...</p>
          ) : (
            categories.map((category) => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  value={category}
                  checked={newStylist.specialization.includes(category)}
                  onChange={handleSpecializationChange}
                />
                {category}
              </label>
            ))
          )}
        </div>

        <input
          type="text"
          placeholder="Image URL"
          value={newStylist.imageUrl}
          onChange={(e) => setNewStylist({ ...newStylist, imageUrl: e.target.value })}
          className="input-field"
        />

        <button onClick={handleAddOrUpdateStylist} className="primary-button" disabled={loading}>
          {loading ? "Processing..." : editingStylist ? "Update Stylist" : "Add Stylist"}
        </button>
      </div>

      {/* Error & Loading States */}
      {loading && <p className="loading">Loading stylists...</p>}
      {error && <p className="error">{error}</p>}

      {/* List of Stylists */}
      <div className="stylist-grid">
        {stylists.length === 0 ? (
          <p>No stylists available.</p>
        ) : (
          stylists.map((stylist) => (
            <div key={stylist.id} className="stylist-card">
              <h3>{stylist.name}</h3>
              <p>Specialization: {stylist.specialization.join(", ") || "None"}</p>
              <img
                src={stylist.imageUrl || "https://via.placeholder.com/100"}
                alt={stylist.name}
                className="stylist-image"
              />

              {/* Availability Toggle */}
              <p>
                Availability:
                <button
                  onClick={() => dispatch(updateStylist({ id: stylist.id, availability: !stylist.availability }))}
                  className={`availability-button ${stylist.availability ? "available" : "not-available"}`}
                >
                  {stylist.availability ? "ON" : "OFF"}
                </button>
              </p>

              {/* Edit & Delete Buttons */}
              <div className="button-group">
                <button onClick={() => handleEditStylist(stylist)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => dispatch(deleteStylist(stylist.id))} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageStylists;
