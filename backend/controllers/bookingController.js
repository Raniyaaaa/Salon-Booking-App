const { Booking }  = require("../models");

exports.bookAppointment = async (req, res) => {
  const { serviceId, stylistId, userId, date, time, paymentStatus, orderId, statusOfBooking } = req.body;

  try {
    
    // Create the booking (status "Scheduled", paymentStatus "Pending")
    const booking = await Booking.create({
      serviceId,
      stylistId,
      userId,
      date,
      time,
      orderId,
      paymentStatus,  // Payment status remains pending until processed
      statusOfBooking,       // Booking status remains scheduled until payment confirmation
    });

    // Return the booking response
    res.status(201).json({
      message: 'Appointment booked successfully',
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed', error });
  }
};
