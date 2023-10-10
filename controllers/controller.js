const express = require("express");
const router = express.Router();
const postRoutes = require("../routes/post");
const accessRoutes = require("../routes/access");
const signUpRoutes = require("../routes/signup");
router.get("/access", accessRoutes.get_access);

//post routes
router.get("/posts", postRoutes.get_posts);
router.post("/posts", postRoutes.new_post);
router.post("/signup", signUpRoutes.signup_post);

module.exports = router;
