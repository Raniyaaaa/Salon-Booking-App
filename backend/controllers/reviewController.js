const { User, Booking, Review, Service }  = require("../models");

exports.leaveReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  try {
    const booking = await Booking.findByPk(bookingId, { include: [User, Service, Staff] });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const review = await Review.create({
      bookingId,
      rating,
      comment,
      userId: booking.User.id,
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
};

exports.getReviews = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { serviceId } });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};
