const { StylistSlot }  = require("../models");

const getBookedSlots = async (req, res) => {
  try {
    const { stylistId } = req.params;
    const { date } = req.query;

    if (!stylistId || !date) {
      return res.status(400).json({ error: 'Stylist ID and date are required' });
    }

    const bookedSlots = await StylistSlot.findAll({
      where: {
        stylistId,
        date,
        is_booked: true,
      },
      attributes: ['time_slot'],
    });

    const bookedTimes = bookedSlots.map(slot => slot.time_slot);

    return res.status(200).json({ bookedSlots: bookedTimes });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return res.status(500).json({ error: 'Something went wrong while fetching slots' });
  }
};


module.exports = {
  getBookedSlots,
};
