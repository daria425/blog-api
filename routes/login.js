const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const login_post = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If authentication is successful, create a JWT token
    jwt.sign({ user }, process.env.SECRET_KEY, (jwtErr, token) => {
      if (jwtErr) {
        return next(jwtErr);
      }

      // Send the JWT token in the response
      res.json({ token });
    });
  })(req, res, next);
};

module.exports = {
  login_post,
};
