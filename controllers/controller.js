const express = require("express");
const router = express.Router();
const indexRoutes = require("../routes/index");
const postRoutes = require("../routes/post");
const accessRoutes = require("../routes/access");
const signUpRoutes = require("../routes/signup");
const loginRoutes = require("../routes/login");

router.get("/", indexRoutes.index_get);
router.get("/access", accessRoutes.get_access);

//post routes
router.get("/posts", postRoutes.get_posts);
router.post("/posts/new", postRoutes.new_post);
router.post("/signup", signUpRoutes.signup_post);

router.post("/login", loginRoutes.login_post);
module.exports = router;
