const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController.js");
const { protect, admin } = require("../middleware/auth.js");

// TODO: Routes

module.exports = router;
