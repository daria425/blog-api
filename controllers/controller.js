const express = require("express");
const router = express.Router();
const indexRoutes = require("../routes/index");
const postRoutes = require("../routes/post");
const accessRoutes = require("../routes/access");
const signUpRoutes = require("../routes/signup");
const loginRoutes = require("../routes/login");
const logoutRoutes = require("../routes/logout");
const categoryRoutes = require("../routes/category");
const commentRoutes = require("../routes/comment");
const refreshRoutes = require("../routes/refresh");
const noVerifyRoutes = require("../routes/noverify");
const gptRoute = require("../services/open-ai");
router.get("/", indexRoutes.index_get);
router.get("/access", accessRoutes.get_access);

router.post("/api/posts/noverify/new", noVerifyRoutes.new_post_no_verify);
//post routes
router.get("/api/posts", postRoutes.get_posts);
router.get("/api/posts/:id", postRoutes.get_post_details);
router.post("/api/posts/:id/comment", commentRoutes.new_comment_post);
router.post("/api/posts/new", postRoutes.new_post);
router.post("/api/posts/delete", postRoutes.delete_post);
router.post("/api/posts/:id/update", postRoutes.update_post);
router.post("/api/posts/:id/imagedelete", postRoutes.delete_image_from_post);
router.post("/api/posts/:id/update-content", postRoutes.update_post_text);
// router.post("/api/posts/:id/delete", postRoutes.delete_post);

router.post("/api/category/new", categoryRoutes.new_category_post);
router.get("/api/category", categoryRoutes.get_all_categories);
router.get("/api/refresh", refreshRoutes.refresh_post);
router.get("/api/category/:id", categoryRoutes.category_details_get);
router.post("/api/category/delete", categoryRoutes.category_delete);
router.post("/api/signup", signUpRoutes.signup_post);

router.post("/api/login", loginRoutes.login_api_post);
router.get("/api/logout", logoutRoutes.log_out_get);
router.get("/api/gpt", gptRoute.callGPT);
module.exports = router;
