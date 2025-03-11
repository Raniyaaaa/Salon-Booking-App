const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }, // Enforcing rating range (1-5)
    },
    comment: {
      type: DataTypes.TEXT, // Allow longer reviews
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Review;
