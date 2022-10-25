const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },

    phone_no: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    isLogin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },

  {
    timestamps: false,
  }
);

module.exports = User;
