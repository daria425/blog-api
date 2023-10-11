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
router.get("/api/posts", postRoutes.get_posts);
router.get("/api/posts/:id", postRoutes.get_post_details);

router.post("/api/posts/new", postRoutes.new_post);
router.post("/api/posts/:id/update", postRoutes.update_post);
router.post("/api/posts/:id/delete", postRoutes.delete_post);
router.post("/api/signup", signUpRoutes.signup_post);

router.post("/api/login", loginRoutes.login_post);
module.exports = router;
