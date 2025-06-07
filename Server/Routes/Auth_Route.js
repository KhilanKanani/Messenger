const express = require("express");
const router = express.Router();
const { SignUp, Login, Logout } = require("../Controller/Auth_Controller");

router.post("/signup", SignUp);
router.post("/login", Login);
router.get("/logout", Logout);

module.exports = router;