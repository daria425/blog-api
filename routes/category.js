const Category = require("../models/categorySchema");
const Post = require("../models/postSchema");
const postRoutes = require("../routes/post");
const new_category_post = [
  postRoutes.verifyToken,
  async (req, res, next) => {
    try {
      const newCategory = new Category({
        name: req.body.name,
        posts: req.body?.posts,
      });
      await newCategory.save();
      res.sendStatus(200);
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
};
