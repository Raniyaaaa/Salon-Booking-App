const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");

const Stylist = sequelize.define(
  "Stylist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialization: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true }
);


module.exports = Stylist;
