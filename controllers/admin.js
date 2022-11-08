const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const Message = require("../models/message");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/user-group");

const generateAccessToken = (id) => {
  return jwt.sign({ emailId: id }, "abc");
};

exports.postUser = (req, res) => {
  const { name: username, email, phone: phone_no, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (!err) {
      try {
        const response = await User.create({
          username,
          email,
          phone_no,
          password: hash,
          isLogin: false,
        });

        res.json("user created");
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "user already exist" });
      }
    } else {
      console.log(err);
    }
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await User.findByPk(email);

    if (!response) {
      res.status(404).json({ msg: "User not found" });
    } else {
      const userPassword = response.dataValues.password;

      bcrypt.compare(password, userPassword, async (err, result) => {
        if (err) {
          console.log(err);
          throw new Error("Something went wrong!!!");
        }

        if (result) {
          response.isLogin = true;

          await response.save();
          res.json({
            response,
            token: generateAccessToken(response.dataValues.email),
          });
        } else {
          res.status(401).json({ msg: "User not authorized" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

exports.postMessage = async (req, res) => {
  const userEmail = req.user.email;
  const { message, selectedGroup } = req.body;

  try {
    const { id } = await Group.findOne({
      where: { grp_name: selectedGroup },
    });

    const response = await Message.create({ message, userEmail, groupId: id });

    res.json({ msg: "message stored successfully" });
  } catch (err) {
    console.log(err);
  }

  res.json(res.body);
};

exports.getAllMessages = async (req, res) => {
  const { lastMessageId, selectedGroup } = req.query;

  try {
    const { id } = await Group.findOne({
      where: { grp_name: selectedGroup },
    });

    const response = await Message.findAll({
      where: {
        [Op.and]: [{ groupId: id }, { id: { [Op.gt]: lastMessageId } }],
      },
    });

    res.json({ msg: "get all messages api called", response });
  } catch (err) {
    console.log(err);
  }
};

exports.getonLineUsers = async (req, res) => {
  try {
    const response = await User.findAll({ where: { isLogin: true } });

    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const response = await User.findAll();

    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.postGroupUsers = async (req, res) => {
  const adminUser = req.user.email;
  const { grpName: grp_name, userEmail } = req.body;

  try {
    const grpExist = await Group.findAll({ where: { grp_name } });

    if (grpExist.length === 0) {
      const response = await Group.create({ grp_name });

      const response2 = await UserGroup.create({
        userEmail: adminUser,
        groupId: response.id,
        admin: true,
      });

      const response1 = await UserGroup.create({
        userEmail,
        groupId: response.id,
        admin: false,
      });
    } else {
      const response1 = await UserGroup.create({
        userEmail,
        groupId: grpExist[0].id,
        admin: false,
      });
    }

    res.json({ msg: "user added successfully to grp" });
  } catch (err) {
    console.log(err);
  }
};

exports.getGroups = async (req, res) => {
  userEmail = req.user.email;

  let groups = [];

  try {
    const response = await UserGroup.findAll({ where: { userEmail } });

    for (let { groupId } of response) {
      const { grp_name } = await Group.findByPk(groupId);

      groups = [...groups, grp_name];
    }

    res.json(groups);
  } catch (err) {
    console.log(err);
  }
};

exports.getGroupUsers = async (req, res) => {
  const { group } = req.params;

  try {
    const response = await Group.findAll({ where: { grp_name: group } });

    console.log(response[0].id);
    const groupId = response[0].id;

    const response1 = await UserGroup.findAll({
      where: { groupId },
    });

    res.json(response1);
  } catch (err) {
    console.log(err);
  }
};

exports.makeAdmin = async (req, res) => {
  const { id } = req.body;
  const { email: userEmail } = req.user;

  console.log(id, userEmail);

  try {
    const grpData = await UserGroup.findByPk(id);
    console.log(grpData);

    const isAdmin = await UserGroup.findAll({
      where: {
        [Op.and]: [{ groupId: grpData.groupId }, { admin: 1 }, { userEmail }],
      },
    });

    console.log(`abcdefg`);
    console.log(isAdmin);

    if (isAdmin.length > 0) {
      grpData.admin = true;

      const response1 = await grpData.save();

      res.json(response1);
    } else {
      res.status(401).json({ msg: "You are not Authorized" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteGroupUser = async (req, res) => {
  const { id } = req.params;
  const { email: userEmail } = req.user;

  console.log(id, userEmail);

  try {
    const { groupId } = await UserGroup.findByPk(id);

    console.log(groupId);

    const isAdmin = await UserGroup.findAll({
      where: { [Op.and]: [{ groupId }, { admin: 1 }, { userEmail }] },
    });

    if (isAdmin.length > 0) {
      const response = await UserGroup.destroy({ where: { id } });

      res.json(response);
    } else {
      res.status(401).json({ msg: "You arre not Authorized" });
    }
  } catch (err) {
    console.log(err);
  }
};
