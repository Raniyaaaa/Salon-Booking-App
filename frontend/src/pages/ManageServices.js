import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  modifyService,
  removeService,
  filterByCategory,
} from "../redux/slices/serviceSlice";
import "../styles.css";

const ManageServices = () => {
  const dispatch = useDispatch();
  const { services, filteredServices, categories } = useSelector((state) => state.services);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    imageUrl: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All"); // ✅ Track active category

  const handleCategoryClick = (category) => {
    dispatch(filterByCategory(category));
    setActiveCategory(category); // ✅ Update active category
  };

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (isEdit) {
      dispatch(modifyService({ ...formData, id: editId })).then(() => {
        dispatch(filterByCategory(formData.category)); // ✅ Force re-filtering
      });
    } else {
      dispatch(createService(formData)).then(() => {
        dispatch(filterByCategory(formData.category)); // ✅ Ensure category updates
      });
    }
  
    resetForm();
  };
  
  const handleEdit = (service) => {
    setFormData({ ...service }); // ✅ Ensure form pre-filling works correctly
    setIsEdit(true);
    setEditId(service.id);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(removeService(id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setFormVisible(!formVisible);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "",
      imageUrl: "",
    });
    setIsEdit(false);
    setEditId(null);
    setFormVisible(false);
  };

  return (
    <div className="manage-services">
      <h2>Manage Services</h2>

      {!formVisible && (
        <div className="button-position">
        <button onClick={toggleForm} className="button">
          + Add Service
        </button>
        </div>
      )}

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
      {formVisible && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input" />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input" />
          </div>
          <div className="form-group">
            <label className="label">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="input" />
          </div>
          <div className="form-group">
            <label className="label">Duration (in minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required className="input" />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="input" />
          </div>
          <div className="form-group">
            <label className="label">Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className="input" />
          </div>
          <button type="submit" className="button">
            {isEdit ? "Update Service" : "Add Service"}
          </button>
          <button type="button" className="button cancel" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      <div className="service-list">
        <h3>Existing Services</h3>
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

                  <div className="service-actions">
                    <button onClick={() => handleEdit(service)} className="service-button edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="service-button delete">
                      Delete
                    </button>
                  </div>
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

export default ManageServices;
