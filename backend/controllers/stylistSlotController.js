const { StylistSlot }  = require("../models");
// Controller to fetch booked slots for a stylist on a specific date
const getBookedSlots = async (req, res) => {
  try {
    const { stylistId } = req.params;
    const { date } = req.query;

    // Validate required fields
    if (!stylistId || !date) {
      return res.status(400).json({ error: 'Stylist ID and date are required' });
    }

    // Fetch all booked slots for the stylist on the given date
    const bookedSlots = await StylistSlot.findAll({
      where: {
        stylistId,
        date,
        is_booked: true, // Get only booked slots
      },
      attributes: ['time_slot'], // Fetch only the time slot field
    });

    // Extract and return all booked time slots
    const bookedTimes = bookedSlots.map(slot => slot.time_slot);

    return res.status(200).json({ bookedSlots: bookedTimes });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return res.status(500).json({ error: 'Something went wrong while fetching slots' });
  }
};

// Export the controller functions
module.exports = {
  getBookedSlots,
};
