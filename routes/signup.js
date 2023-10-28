const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      const match = await bcrypt.compare(password, user.password);
      if (!user) {
        console.log("Incorrect username");
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        console.log("INcorrect password");
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
const signup_get = (req, res, next) => {
  //do smth
};
const signup_post = async (req, res, next) => {
  try {
    console.log(req);
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
    });
    await user.save();
    console.log(`user ${user.username} saved to db`);
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      jwt.sign({ user: user }, process.env.SECRET_KEY, (err, token) => {
        res.send({ token });
      });
    });
  } catch (err) {
    console.log(req);
    console.log(err);
    res.sendStatus(404);
  }
};

module.exports = {
  signup_post,
  signup_get,
};
