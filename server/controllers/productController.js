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

exports.product_update = [
  body("name").optional().trim().isLength({ min: 1 }).escape(),
  body("description").optional().trim().isLength({ min: 1 }).escape(),
  body("category").optional().trim().isLength({ min: 1 }).escape(),
  body("stock").optional().isInt({ min: 0 }),
  body("price").optional().isFloat({ min: 0 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      if (req.file) {
        if (product.cloudinaryId) {
          await cloudinary.uploader.destory(product.cloudinaryId);
        }
        product.image = req.file.path;
        product.cloudinaryId = req.file.filename;
      }

      const updatedProduct = await product.save();
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    }
  }),
];

exports.product_delete = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.cloudinaryId) {
      await cloudinary.uploader.destory(product.cloudinaryId);
    }
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Product deleted successfully" });
  }
});
