const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController.js");
const { protect, admin } = require("../middleware/auth.js");
const product = require("../models/product.js");
const upload = require("../config/multer.js");

// TODO: Routes
router.get("/products", productController.products);
router.get("/products/:id", productController.products_detail);
// router.post("/products/create", protect, admin, upload.single("image"), productController.product_create);

module.exports = router;
