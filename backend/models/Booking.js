const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Booking = sequelize.define("Booking", {
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Services", key: "id" },
  },
  stylistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Stylists", key: "id" },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" }, 
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed", 'refunded'),
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
