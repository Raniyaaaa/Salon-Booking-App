const cron = require("node-cron");
const moment = require("moment-timezone");
const { Booking, Service, User }  = require("../models");
const { sendEmail } = require("../cron/sendEmail");

const getTodayDateInIST = () => {
  return moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
};

cron.schedule("0 7 * * *", async () => {
  try {
    const today = getTodayDateInIST();

    const upcomingBookings = await Booking.findAll({
      where: { date: today },
      include: [
        { model: User, attributes: ["email"] },
        { model: Service, attributes: ["name"]},
      ],
    });

    if (upcomingBookings.length === 0) {
      console.log("No appointments for today.");
      return;
    }

    upcomingBookings.forEach((booking) => {
      const email = booking?.User?.dataValues?.email
      const serviceName = booking?.Service?.dataValues?.name
      const appointmentTime = booking.time;

      const userEmail = booking?.User?.dataValues?.email;
      console.log("User Email:", userEmail);

      if (email && serviceName && appointmentTime) {
        sendEmail(email, "Appointment Reminder", `You have an appointment for ${serviceName} today at ${appointmentTime}. Please be on time.`);
      }
    });

    console.log(`Sent ${upcomingBookings.length} reminder emails successfully.`);
  } catch (error) {
    console.error("Error running cron job:", error);
  }
}, {
  timezone: "Asia/Kolkata",
});
