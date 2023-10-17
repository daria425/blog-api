const Post = require("../models/postSchema");
const multer = require("multer");
const Category = require("../models/categorySchema");
const fs = require("fs");
const path = require("path");
const upload = multer({ dest: "../uploads" });

const new_post_no_verify = [
  upload.any("images"),
  async (req, res, next) => {
    try {
      const imageSources = [];
      console.log(req.files);
      if (typeof req.files !== "undefined") {
        req.files.forEach((file) => {
          imageSources.push({
            data: fs.readFileSync(path.join("../uploads/" + file.filename)),
            contentType: "image/jpg",
          });
        });
      }

      console.log(req.body);
      const newPost = new Post({
        title: req.body.title,
        content: {
          subheadings: req.body.content?.subheadings || [],
          snippets: req.body.content?.snippets || [],
          main_text: req.body.content.main_text,
        },
        image_sources: imageSources.length <= 0 ? [] : imageSources,
        category: req.body.category,
        tags: req.body.tags,
        author: req.body.userid,
        is_published: req.body.is_published,
      });
      const savedPost = await newPost.save();
      await Category.updateOne(
        { _id: req.body.category },
        { $push: { posts: savedPost._id } }
      );

      res.sendStatus(200);
    } catch (errors) {
      console.log(errors);
    }
  },
];

module.exports = {
  new_post_no_verify,
};
