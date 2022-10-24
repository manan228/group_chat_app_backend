const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const generateAccessToken = (id) => {
  return jwt.sign({ emailId: id }, "abc");
};

exports.postUser = (req, res) => {
  console.log(`inside get`, req.body);

  const { name: username, email, phone: phone_no, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (!err) {
      try {
        const response = await User.create({
          username,
          email,
          phone_no,
          password: hash,
        });

        console.log(response);

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
  // console.log(req.body)
  const { email, password } = req.body;

  try {
    const response = await User.findByPk(email);

    if (!response) {
      res.status(404).json({ msg: "User not found" });
    } else {
      const userPassword = response.dataValues.password;

      bcrypt.compare(password, userPassword, (err, result) => {
        console.log(`inside bcrypt compare`);
        if (err) {
          console.log(err);
          console.log(`inside err`);
          throw new Error("Something went wrong!!!");
        }

        if (result) {
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

  // res.json(`inside login backend`);
};
