const Category = require("../models/categorySchema");
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

module.exports = {
  new_category_post,
};
