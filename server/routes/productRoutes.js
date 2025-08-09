const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController.js");
const { protect, admin } = require("../middleware/auth.js");
const product = require("../models/product.js");
const upload = require("../config/multer.js");

router
  .route("/")
  .get(productController.products)
  .post(
    protect,
    admin,
    upload.single("image"),
    productController.product_create,
  );
router
  .route("/:id")
  .get(productController.products_detail)
  .put(protect, admin, upload.single("image"), productController.product_update)
  .delete(protect, admin, productController.product_delete);

module.exports = router;
