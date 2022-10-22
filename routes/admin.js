const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/signup", adminController.postUser);

module.exports = router;
