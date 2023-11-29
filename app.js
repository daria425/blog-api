require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const createError = require("http-errors");
const express = require("express");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:5173",
    "https://main--dapper-horse-7e795d.netlify.app",
    "https://dapper-horse-7e795d.netlify.app/",
  ],
};
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const controller = require("./controllers/controller");

const app = express();

async function dbConnection() {
  try {
    await mongoose.connect(process.env.DRIVER_CODE);
    console.log("successful connection");
  } catch (err) {
    console.log(err);
  }
}
dbConnection();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(limiter);
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", controller);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
