const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  image: { type: String, required: true, default: "../uploads/placeholder" },
  cloudinaryId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.virtual("url").get(function () {
  return `/products/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
