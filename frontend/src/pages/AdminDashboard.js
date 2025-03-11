import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="admin-controls">
        <button className="btn btn-primary">Manage Users</button>
        <button className="btn btn-secondary">Manage Appointments</button>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/manageservices')}>Manage Service</button>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/managestylists')}>Manage Stylists</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
