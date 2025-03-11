const { Booking, Service, StylistSlot }  = require("../models");
const axios = require("axios");

const CASHFREE_API_BASE = "https://sandbox.cashfree.com/pg"; // Change for production

// Helper function to convert 12-hour format to 24-hour format
const convertTo24HourFormat = (time12h) => {
  const match = time12h.match(/(\d+):(\d+) (\w{2})/);
  if (!match) return null; // Handle invalid time format

  let [_, hour, minute, period] = match;
  hour = parseInt(hour);
  minute = parseInt(minute);

  if (period.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

// Create a new Booking & Initiate Payment
exports.createPayment = async (req, res) => {
  try {
    const { serviceId, stylistId, userId, date, time, amount, customerEmail, customerPhone } = req.body;

    console.log("Request Body:", req.body);
    
    const orderId = `order_${Date.now()}`;
    const formattedTime = convertTo24HourFormat(time) || time; // Convert time if necessary
    
    const paymentResponse = await axios.post(
      `${CASHFREE_API_BASE}/orders`,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: userId.toString(),
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/payment-status?order_id=${orderId}`,
          payment_methods: "upi,cc,dc",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    if (!paymentResponse.data?.payment_session_id) {
      throw new Error("Failed to create payment order");
    }

    await Booking.create({
      serviceId,
      stylistId,
      userId,
      date,
      time: formattedTime, // Store in 24-hour format
      paymentStatus: "pending",
      orderId,
      statusOfBooking: "scheduled",
    });

    res.status(200).json({
      paymentSessionId: paymentResponse.data.payment_session_id,
      orderId,
    });
  } catch (error) {
    console.error("Payment initiation error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to initiate payment" });
  }
};

// Verify Payment and Update Booking
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const booking = await Booking.findOne({ where: { orderId } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const paymentStatusResponse = await axios.get(
      `${CASHFREE_API_BASE}/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    const paymentStatus = paymentStatusResponse.data.order_status; // 'PAID', 'FAILED', 'PENDING'

    if (paymentStatus === "PAID") {
      await booking.update({ paymentStatus: "paid", statusOfBooking: "scheduled" });

      const service = await Service.findOne({ where: { id: booking.serviceId } });
      if (!service) return res.status(400).json({ success: false, message: "Service not found" });

      const serviceDuration = service.duration;
      const slotInterval = 15;
      const [hour, minute] = booking.time.split(":").map(Number);
      const requiredSlots = Math.ceil(serviceDuration / slotInterval);
      
      const slotsToCreate = [];
      for (let i = 0; i < requiredSlots; i++) {
        let slotHour = hour;
        let slotMinute = minute + i * slotInterval;

        if (slotMinute >= 60) {
          slotHour += Math.floor(slotMinute / 60);
          slotMinute = slotMinute % 60;
        }

        const formattedTime = `${String(slotHour).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`;

        slotsToCreate.push({
          stylistId: booking.stylistId,
          date: booking.date,
          time_slot: formattedTime,
          is_booked: true,
        });
      }

      await StylistSlot.bulkCreate(slotsToCreate);
      return res.status(200).json({ success: true, message: "Payment successful, slots created", status: "paid" });
    } else if (paymentStatus === "FAILED") {
      await booking.destroy();
      return res.status(400).json({ success: false, message: "Payment failed", status: "failed" });
    } else {
      return res.status(202).json({ success: true, message: "Payment pending", status: "pending" });
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
