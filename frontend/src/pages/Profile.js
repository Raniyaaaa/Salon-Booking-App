import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAppointments, cancelUserAppointment } from "../redux/slices/bookingSlice";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Profile = () => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.booking);

  useEffect(() => {
    if (user) {
      dispatch(getAppointments(token));
    }
  }, [dispatch, user]);

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      dispatch(cancelUserAppointment(appointmentId));
    }
  };


  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      {user ? (
        <>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
          </div>

          <h3 className="appointment-title">My Appointments</h3>
          {appointments.length > 0 ? (
             <div className="table-container">
             <table className="appointments-table">
               <thead>
                 <tr>
                   <th style={{ width: "20%" }}>Service</th>
                   <th style={{ width: "20%" }}>Stylist</th>
                   <th style={{ width: "15%" }}>Date</th>
                   <th style={{ width: "15%" }}>Time</th>
                   <th style={{ width: "15%" }}>Status</th>
                   <th style={{ width: "15%" }}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {appointments.map((appointment) => (
                   <tr key={appointment.id}>
                     <td>{appointment.Service.name}</td>
                     <td>{appointment.Stylist.name}</td>
                     <td>{appointment.date}</td>
                     <td>{appointment.time}</td>
                     <td>{appointment.statusOfBooking}</td>
                     <td>
                       {appointment.statusOfBooking === "scheduled" && (
                         <button 
                           className="cancel-btn" 
                           onClick={() => handleCancelAppointment(appointment.id)}
                         >
                           Cancel
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>                    
          ) : (
            <p className="no-appointments">No appointments booked.</p>
          )}
        </>
      ) : (
        <p className="error-message">User not found. Please login.</p>
      )}
    </div>
  );
};

export default Profile;
