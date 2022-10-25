const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
  console.log(`inside authenticate middleware`);
  const token = req.header("Authorization");

  const { emailId } = jwt.verify(token, "abc");

  console.log(emailId);

  try {
    const response = await User.findByPk(emailId);

    console.log(response);
    req.user = response;

    next();
  } catch (err) {
    console.log(err);
  }
};
