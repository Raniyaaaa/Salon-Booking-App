import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchServices, setServices } from "../redux/slices/serviceSlice";
import { fetchStylists } from "../redux/slices/stylistSlice";
import { load } from "@cashfreepayments/cashfree-js";
import "./ServiceDetailsPage.css";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.services);
  const { stylists } = useSelector((state) => state.stylists);
  const URL = "http://localhost:8000";
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchStylists());
  }, [dispatch]);

  const service = services.find((s) => s.id === parseInt(id));
  const availableStylists = stylists.filter((stylist) =>
    stylist.specialization.includes(service?.category)
  );

  const isBookingFull = availableStylists.every((stylist) => !stylist.availability);

  const handleStylistSelection = (stylistId) => {
    setSelectedStylist(stylistId);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableTimeSlots([]);
    setBookedSlots([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedStylist) {
      fetchBookedSlots(selectedStylist, date);
    }
  };

  const fetchBookedSlots = async (stylistId, date) => {
    try {
      const response = await fetch(`${URL}/stylistslot/${stylistId}/slots?date=${date}`);
      const data = await response.json();
      if (response.ok) {
        const bookedSlots = data.bookedSlots || [];
        setBookedSlots(bookedSlots);
        setAvailableTimeSlots(generateTimeSlots(service.duration, bookedSlots));
      } else {
        console.error("Error fetching booked slots");
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    }
  };

  const generateTimeSlots = (serviceDuration, bookedSlots) => {
    const slots = [];
    const startTime = new Date().setHours(10, 0, 0, 0);
    const endTime = new Date().setHours(19, 45, 0, 0);
    const interval = 15 * 60 * 1000;
    const totalSlotsNeeded = Math.ceil(serviceDuration / 15);

    console.log("Booked Slots:", bookedSlots);

    let currentTime = startTime;

    while (currentTime <= endTime) {
        const timeString = new Date(currentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); // 24-hour format
        slots.push(timeString);
        currentTime += interval;
    }
    const canFitService = (index) => {
        for (let i = 0; i < totalSlotsNeeded; i++) {
            if (!slots[index + i] || bookedSlots.includes(slots[index + i])) {
                return false;
            }
        }
        return true;
    };

    const availableSlots = slots.filter((_, index) => canFitService(index));

    console.log("Available Slots:", availableSlots);
    return availableSlots;
};

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const handlePayment = async () => {
    setLoading(true);

    if (!selectedStylist || !selectedDate || !selectedTime) {
      alert("Please select a stylist, date, and time.");
      setLoading(false);
      return;
    }

    try {
        const cf = await load({ mode: "sandbox" });
        const paymentData = {
            serviceId: service.id,
            stylistId: selectedStylist,
            userId: 1,
            date: selectedDate,
            time: selectedTime,
            amount: service.price,
            customerEmail: "test@example.com",
            customerPhone: "9876543210"
        };

        const response = await fetch(`${URL}/payment/create-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error("Failed to create payment session");
        }
        const data = await response.json();
        console.log(data)
        if (data.paymentSessionId) {
            cf.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_modal",
            });

            setTimeout(() => pollPaymentStatus(data.orderId), 5000);
        } else {
            console.error("Failed to create order");
        }
    } catch (error) {
        console.error("Payment Error:", error);
    } finally {
        setLoading(false);
    }
};

const pollPaymentStatus = async (orderId, attempt = 1) => {
    const maxAttempts = 10;
    const delay = Math.min(3000 * attempt, 15000);

    try {
        const response = await fetch(`${URL}/payment/verify-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.status === "paid") {
            alert("Payment Successful! See You !!.");
            setShowSuccessModal(true);
            return;
        }
        if (data.status === "failed") {
            alert("Payment Failed. Please try again.");
            return;
        }

        if (attempt < maxAttempts) {
            setTimeout(() => pollPaymentStatus(orderId, attempt + 1), delay);
        } else {
            alert("Payment status unknown. Please check your payment history.");
        }
    } catch (error) {
        console.error("Error fetching payment status:", error);
        if (attempt < maxAttempts) {
            setTimeout(() => pollPaymentStatus(orderId, attempt + 1), delay);
        }
    }
};

return (
    <div className="ser-details">
         {service ? (
        <>
          <div className="ser-details-container">
            <div className="ser-image-container">
              <img src={service.imageUrl} alt={service.name} className="ser-image" />
            </div>
            <div className="ser-description">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p>Price: Rs.{service.price}</p>
              <p>Duration: {service.duration} minutes</p>
            </div>
          </div>

          <div className="styl-selection">
            <h3>Select a Stylist:</h3>
            {isBookingFull ? (
              <p>Booking Full, Choose Another Slot</p>
            ) : (
              <div className="styl-list">
                {availableStylists.map((stylist) => (
                  <div
                    key={stylist.id}
                    className={`styl-card ${stylist.availability ? "" : "blurred"}`}
                  >
                    <label className="styl-label">
                      <input
                        type="radio"
                        name="stylist"
                        value={stylist.id}
                        disabled={!stylist.availability}
                        onChange={() => handleStylistSelection(stylist.id)}
                      />
                      <div className="styl-info">
                        <img src={stylist.imageUrl} alt={stylist.name} className="styl-image" />
                        <span>{stylist.name}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedStylist && (
            <div className="date-time-picker">
              <label>Choose Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>
          )}

          {selectedDate && (
            <div className="time-slot-picker">
              <label>Choose Time:</label>
              <div className="time-slot-list">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((time, index) => (
                    <button
                      key={index}
                      className={`time-slot-button`}
                      onClick={() => handleTimeSelection(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : 
                    (
                  <p>No available slots for this date</p>
                )
                }
              </div>
            </div>
          )}

          <div className="payment-container">
            <h3>Total Amount: Rs.{service.price}</h3>
            <button
              onClick={handlePayment}
              disabled={!selectedStylist || !selectedDate || !selectedTime }
              className="pay-button"
              >
              Pay Now
            </button>
          </div>
        </>
      ) : (
        <p>Service not found.</p>
      )}
      {showSuccessModal && (
        <div className="success-container" key={modalKey}>
          <div className="success">
            <h2>Payment Successful!</h2>
            <p>Your appointment has been booked successfully.</p>
            <button onClick={() => navigate("/dashboard/services")} className="success-btn">
              OK
            </button>
          </div>
        </div>
      )}
</div>
);
};

export default ServiceDetailsPage;
