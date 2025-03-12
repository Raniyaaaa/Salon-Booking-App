const { Booking, Service, Stylist, StylistSlot }  = require("../models");

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Service,
          attributes: ["name"],
        },
        {
          model: Stylist,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Booking.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.statusOfBooking !== "scheduled") {
      return res.status(400).json({ success: false, message: "Only scheduled appointments can be canceled" });
    }

    const service = await Service.findByPk(appointment.serviceId);
    if (!service) {
      return res.status(400).json({ success: false, message: "Service not found" });
    }

    const serviceDuration = service.duration;
    const slotInterval = 15;
    const requiredSlots = Math.ceil(serviceDuration / slotInterval);

    const [hour, minute] = appointment.time.split(":").map(Number);

    const slotsToDelete = [];
    for (let i = 0; i < requiredSlots; i++) {
      let slotHour = hour;
      let slotMinute = minute + i * slotInterval;

      if (slotMinute >= 60) {
        slotHour += Math.floor(slotMinute / 60);
        slotMinute = slotMinute % 60;
      }

      const formattedTime = `${String(slotHour).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`;
      slotsToDelete.push(formattedTime);
    }

    await StylistSlot.destroy({
      where: {
        date: appointment.date,
        time_slot: slotsToDelete,
      },
    });

    appointment.statusOfBooking = "cancelled";
    await appointment.save();
    if (appointment.paymentStatus === "paid") {
      appointment.paymentStatus = "refunded";
      await appointment.save();
    }

    return res.status(200).json({ success: true, message: "Appointment cancelled, all slots freed up" });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({ success: false, message: "Error cancelling appointment", error: error.message });
  }
};

module.exports = { getUserAppointments, cancelAppointment };
