const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Product = require("../models/product.js");

exports.products = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

exports.products_detail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.status(200).json(product);
});

exports.product_create = [
  body("name", "Product name is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Product description is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock is required.").isInt({ min: 0 }),
  body("price", "Price is required.").isFloat({ min: 0 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, stock, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const newProduct = new Product({
      image: req.file.path,
      cloudinaryId: req.file.filename,
      name,
      description,
      category,
      stock,
      price,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  }),
];
