const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Message = sequelize.define(
  "messages",
  {
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Message;
