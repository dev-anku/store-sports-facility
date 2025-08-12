const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController.js");
const { protect, admin } = require("../middleware/auth.js");

router
  .route("/")
  .post(protect, orderController.order_create)
  .get(protect, orderController.user_orders);

router.route("/all").get(protect, admin, orderController.all_orders);

router.route("/:id/status").put(protect, admin, orderController.order_update);

module.exports = router;
