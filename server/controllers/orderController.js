const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Order = require("../models/order.js");
const Product = require("../models/product.js");

exports.order_create = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingInfo, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product ${item.name} not found` });
    }
    if (product.stock < item.quantity) {
      return res
        .status(400)
        .json({ message: `Insufficient stock for product ${item.name}` });
    }
    product.stock -= item.quantity;
    await product.save();
  }

  const order = new Order({
    user: req.user._id,
    products: orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    shippingInfo,
    totalPrice,
  });

  await order.save();
  res.status(201).json({ order, message: "Order placed" });
});

exports.user_orders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "products.productId",
    "name price image",
  );
  res.status(200).json(orders);
});

exports.all_orders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("products.productId", "name price image");
  res.status(200).json(orders);
});

exports.order_update = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status || order.status;
    await order.save();
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: "Order not found." });
  }
});
