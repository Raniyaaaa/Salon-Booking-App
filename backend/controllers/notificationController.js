const { sendEmail } = require('../cron/sendEmail');

const { Booking }  = require("../models");

exports.sendAppointmentReminder = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [Service, Stylist],
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const message = `Reminder: Your appointment for ${booking.Service.name} with ${booking.Stylist.name} is scheduled at ${booking.time}`;

    sendEmail(booking.User.email, 'Appointment Reminder', message);

    res.status(200).json({ message: 'Reminder sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reminder', error });
  }
};
