const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const adminRoutes = require("./routes/admin");

const User = require("./models/user");
const Message = require("./models/message");
const Group = require("./models/group");
const UserGroup = require("./models/user-group");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(adminRoutes);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

Group.hasMany(Message);
Message.belongsTo(Group);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
