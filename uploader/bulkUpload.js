const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const API_URL = "http://localhost:5000/api/products/create";

const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));

async function uploadProduct(product) {
  try {
    const form = new FormData();

    form.append("name", product.name);
    form.append("description", product.description);
    form.append("category", product.category);
    form.append("stock", product.stock);
    form.append("price", product.price);

    const imagePath = path.resolve(product.image);
    form.append("image", fs.createReadStream(imagePath));

    const res = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log(`Uploaded: ${product.name} - ID: ${res.data.product._id}`);
  } catch (err) {
    console.error(
      `Error uploading ${product.name}:`,
      err.response?.data || err.message,
    );
  }
}

async function run() {
  for (const product of products) {
    await uploadProduct(product);
  }

  console.log("Upload finished, aage kaam karle, or dheeru bandar hai");
}

run();
