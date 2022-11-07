const express = require("express");

const adminController = require("../controllers/admin");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.post("/signup", adminController.postUser);

router.post("/login", adminController.postLogin);

router.post(
  "/send-message",
  userAuthentication.authenticate,
  adminController.postMessage
);

router.get("/all-messages", adminController.getAllMessages);

router.get("/online-users", adminController.getonLineUsers);

router.get("/get-all-users", adminController.getAllUsers);

router.post(
  "/create-new-group",
  userAuthentication.authenticate,
  adminController.postGroupUsers
);

router.get(
  "/get-groups",
  userAuthentication.authenticate,
  adminController.getGroups
);

module.exports = router;
