const sequelize = require("../util/db");

const User = require("./User");
const Service = require("./Service");
const Stylist = require("./Stylist");
const Booking = require("./Booking");
const StylistSlot = require("./StylistSlot");
const Review = require("./Review");

// Define relationships
User.hasMany(Booking, { foreignKey: "userId", as: "bookings", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

Service.hasMany(Booking, { foreignKey: "serviceId", onDelete: "CASCADE" });
Booking.belongsTo(Service, { foreignKey: "serviceId", onDelete: "CASCADE" });

Stylist.hasMany(StylistSlot, { foreignKey: "stylistId", onDelete: "CASCADE" });
StylistSlot.belongsTo(Stylist, { foreignKey: "stylistId", onDelete: "CASCADE" });

Stylist.hasMany(Booking, { foreignKey: "stylistId", onDelete: "CASCADE" });
Booking.belongsTo(Stylist, { foreignKey: "stylistId", onDelete: "CASCADE" });

StylistSlot.hasOne(Booking, { foreignKey: "stylistSlotId", onDelete: "CASCADE" });
Booking.belongsTo(StylistSlot, { foreignKey: "stylistSlotId", onDelete: "CASCADE" });

Review.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = { sequelize, User, Service, Stylist, Booking, StylistSlot, Review };
