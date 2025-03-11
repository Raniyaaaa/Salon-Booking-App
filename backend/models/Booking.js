const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Booking = sequelize.define("Booking", {
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Services", key: "id" }, // Explicit FK reference
  },
  stylistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Stylists", key: "id" }, // Explicit FK reference
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" }, // Explicit FK reference
  },
  date: {
    type: DataTypes.DATEONLY, // Changed from STRING to DATEONLY
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME, // Changed from STRING to TIME
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusOfBooking: {
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    defaultValue: "scheduled",
  },
}, { timestamps: true });


module.exports = Booking;
