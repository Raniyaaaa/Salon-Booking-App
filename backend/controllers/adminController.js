const { User, Booking }  = require("../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

exports.manageBooking = async (req, res) => {
  const { bookingId, action } = req.body;
  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (action === 'cancel') {
      await booking.update({ status: 'Cancelled' });
    } else if (action === 'confirm') {
      await booking.update({ status: 'Confirmed' });
    }
    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error managing booking', error });
  }
};
