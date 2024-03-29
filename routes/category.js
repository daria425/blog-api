const Category = require("../models/categorySchema");
const Post = require("../models/postSchema");
const postRoutes = require("../routes/post");

const get_all_categories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("posts").exec();
    res.send(categories);
  } catch (err) {
    console.log(err);
    res.send(`Error: ${err}`);
    res.status(500);
  }
};
const new_category_post = [
  postRoutes.verifyToken,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const categoryPosts = JSON.parse(req.body.posts);
      const newCategory = new Category({
        name: req.body.name,
        posts: categoryPosts,
      });
      await newCategory.save();
      res.send(newCategory);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
];

const category_details_get = async (req, res, next) => {
  try {
    const selectedCategory = await Category.findById(req.params.id)
      .populate("posts")
      .exec();
    res.send(selectedCategory);
  } catch (err) {
    console.log(err);
    res.send(`Error ${err}`);
  }
};

const category_delete = [
  postRoutes.verifyToken,
  async (req, res, next) => {
    try {
      await Promise.all([
        Category.findByIdAndDelete(req.body.categoryid).exec(),
        Post.deleteMany({ category: req.body.categoryid }).exec(),
      ]);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.send(`Error: ${err}`);
    }
  },
];
module.exports = {
  new_category_post,
  category_details_get,
  category_delete,
  get_all_categories,
};
