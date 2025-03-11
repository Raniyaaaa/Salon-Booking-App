import React from "react";
import { useSelector } from "react-redux";
import "../styles.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {user ? (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="error-message">User not found. Please login.</p>
      )}
    </div>
  );
};

export default Profile;
