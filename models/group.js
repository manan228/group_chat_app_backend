const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Group = sequelize.define(
  "group",
  {
    grp_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Group;
