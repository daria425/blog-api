const express = require("express");
const router = express.Router();
const indexRoutes = require("../routes/index");
const postRoutes = require("../routes/post");
const accessRoutes = require("../routes/access");
const signUpRoutes = require("../routes/signup");
const loginRoutes = require("../routes/login");
const categoryRoutes = require("../routes/category");
const commentRoutes = require("../routes/comment");
const refreshRoutes = require("../routes/refresh");
router.get("/", indexRoutes.index_get);
router.get("/access", accessRoutes.get_access);

//post routes
router.get("/api/posts", postRoutes.get_posts);
router.get("/api/posts/:id", postRoutes.get_post_details);
router.post("/api/posts/:id/comment", commentRoutes.new_comment_post);
router.post("/api/posts/new", postRoutes.new_post);
router.post("/api/posts/delete", postRoutes.delete_post);
router.post("/api/posts/:id/update", postRoutes.update_post);
// router.post("/api/posts/:id/delete", postRoutes.delete_post);

router.post("/api/category/new", categoryRoutes.new_category_post);
router.get("/api/refresh", refreshRoutes.refresh_post);
router.get("/api/category/:id", categoryRoutes.category_details_get);
router.post("/api/category/delete", categoryRoutes.category_delete);
router.post("/api/signup", signUpRoutes.signup_post);

router.post("/api/login", loginRoutes.login_api_post);
module.exports = router;
