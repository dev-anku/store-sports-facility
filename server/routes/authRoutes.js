const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");
const { protect } = require("../middleware/auth.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/me", protect, authController.me);

module.exports = router;
