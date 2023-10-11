const Post = require("../models/postSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
var fs = require("fs");
var path = require("path");
const upload = multer({ dest: "../uploads" });

const get_posts = async (req, res, next) => {
  try {
    const allPosts = await Post.find().exec();
    res.send(allPosts);
  } catch (err) {
    console.log(err);
  }
};

const get_post_details = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username id")
      .exec();
    res.send(post);
  } catch (err) {
    console.log(err);
  }
};

const update_post = [
  verifyToken,
  upload.any("images"),
  async (req, res, next) => {
    try {
      const imageSources = [];

      if (typeof req.files !== "undefined") {
        req.files.forEach((file) => {
          imageSources.push({
            data: fs.readFileSync(path.join("../uploads/" + file.filename)),
            contentType: "image/jpg",
          });
        });
      }
      const updatedPost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: {
          subheadings: req.body.content?.subheadings || [],
          snippets: req.body.content?.snippets || [],
          main_text: req.body.content.main_text,
        },
        image_sources: imageSources.length <= 0 ? [] : imageSources,
        author: req.user.user._id,
        is_published: req.body.is_published,
      });
      await Post.findByIdAndUpdate(req.params.id, updatedPost, {}).exec();
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.send(`Error: ${err.message}`);
    }
  },
];

const delete_post = [
  verifyToken,
  async (req, res, next) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.send(`Error: ${err.message}`);
    }
  },
];
const new_post = [
  verifyToken,
  upload.any("images"),
  async (req, res, next) => {
    try {
      const imageSources = [];

      if (typeof req.files !== "undefined") {
        req.files.forEach((file) => {
          imageSources.push({
            data: fs.readFileSync(path.join("../uploads/" + file.filename)),
            contentType: "image/jpg",
          });
        });
      }

      console.log(req);
      const newPost = new Post({
        title: req.body.title,
        content: {
          subheadings: req.body.content?.subheadings || [],
          snippets: req.body.content?.snippets || [],
          main_text: req.body.content.main_text,
        },
        image_sources: imageSources.length <= 0 ? [] : imageSources,
        author: req.user.user._id,
        is_published: req.body.is_published,
      });
      await newPost.save();
      res.sendStatus(200);
    } catch (errors) {
      console.log(errors);
    }
  },
];

function verifyToken(req, res, next) {
  console.log("request recieved");
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        res.sendStatus(403);
        // Forbidden
      } else {
        // console.log(decoded);
        req.user = decoded; // Set req.user with the decoded user information
        req.token = token;
        next();
      }
    });
  } else {
    console.log(req.headers);
    res.sendStatus(403); // Forbidden
  }
}

module.exports = {
  get_posts,
  new_post,
  get_post_details,
  update_post,
  delete_post,
};

//router.post("/posts", verifyToken, (req, res, next) => {
// jwt.verify(req.token, "svintus", (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.send({ message: "new message", authData });
//     }
//   });
// });
