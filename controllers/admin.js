const bcrypt = require("bcrypt");

const User = require("../models/user");

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
