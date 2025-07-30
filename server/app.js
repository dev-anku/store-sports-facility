const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("trust proxy", 1);

mongoose.connect(process.env.MONGODB).catch((err) => {
  console.error(err);
});

const authRoutes = require("./routes/authRoutes.js");

app.use("/api/auth", authRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
