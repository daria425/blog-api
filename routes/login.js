const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const login_api_post = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If authentication is successful, create a JWT token
    // jwt.sign({ user }, process.env.SECRET_KEY, (jwtErr, token) => {
    //   if (jwtErr) {
    //     return next(jwtErr);
    //   }

    //   // Send the JWT token in the response
    //   res.json({ token });
    // });
    const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "15m", // Set expiration for 15 minutes
    });

    const refreshToken = jwt.sign({ user }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "7d", // Set a longer expiration for the refresh token, e.g., 7 days
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      SameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("user", user.username, {
      httpOnly: false,
      SameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Send both tokens in the response
    res.send({ accessToken, refreshToken });
  })(req, res, next);
};

module.exports = {
  login_api_post,
};
