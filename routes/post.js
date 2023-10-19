const Post = require("../models/postSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Category = require("../models/categorySchema");
const fs = require("fs");
const path = require("path");
const upload = multer({ dest: "../uploads" });

const refreshRoute = require("../routes/refresh");
const get_posts = async (req, res, next) => {
  try {
    const allPosts = await Post.find()
      .populate("category")
      .populate("comments")
      .exec();
    res.send(allPosts);
  } catch (err) {
    console.log(err);
  }
};

const get_post_details = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username id")
      .populate("comments")
      .exec();
    res.send(post);
  } catch (err) {
    console.log(err);
  }
};

const update_post = [
  verifyToken,
  upload.any(),
  async (req, res, next) => {
    try {
      const prevItem = await Post.findById(req.params.id);
      const tags = JSON.parse(req.body.tags);

      const contentObj = JSON.parse(req.body.content);
      console.log(tags, req.body.tags);
      console.log(req.files);
      const imageSources =
        req.files.length > 0
          ? req.files.map((file) => ({
              data: fs.readFileSync(path.join("../uploads/" + file.filename)),
              contentType: "image/jpg",
            }))
          : prevItem.image_sources;
      console.log(imageSources);
      const updatedPost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: contentObj,
        image_sources: prevItem.image_sources.concat(imageSources), //add uploaded images to images that r already there
        author: req.user.user._id,
        category: req.body.category,
        tags: tags,
        is_published: req.body.is_published,
      });
      await Post.findByIdAndUpdate(req.params.id, updatedPost, {}).exec();
      console.log("post updated");
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.send(`Update Error: ${err.message}`);
    }
  },
];

const delete_post = [
  verifyToken,
  async (req, res, next) => {
    try {
      //const query={posts: req.body.postid}
      //const update=
      const [post, categoryResult] = await Promise.all([
        Post.findByIdAndDelete(req.body.postid),
        Category.updateMany(
          { posts: req.body.postid },
          {
            $pull: { posts: req.body.postid },
          }
        ),
      ]);
      console.log(categoryResult);
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
        author: req.user.user._id,
        is_published: req.body.is_published,
      });
      const savedPost = await newPost.save();
      await Category.updateOne(
        { _id: req.body.category },
        { $push: { posts: savedPost._id } }
      );

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(`Error: ${err.message}`);
    }
  },
];

const delete_image_from_post = [
  verifyToken,
  async (req, res, next) => {
    try {
      console.log(req.body.image_to_delete);
      const selectedImage = await Post.updateOne(
        { _id: req.params.id },
        { $pull: { image_sources: { _id: req.body.image_to_delete } } }
      );
      console.log(selectedImage);
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(`Error: ${err.message}`);
    }
  },
];

function verifyToken(req, res, next) {
  console.log("request recieved");
  const bearerHeader = req.headers["authorization"];
  const key = req.headers["x-api-key"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    jwt.verify(token, key, async (err, decoded) => {
      if (err) {
        console.log("Access token verification failed:", err);
        // res.sendStatus(403);
        // Redirect to '/refresh' for token refreshing
        try {
          const { accessToken, user } = await refreshRoute.refresh_post(
            req,
            res,
            next
          );
          req.token = accessToken;
          req.user = user;
          next();
        } catch (refreshErr) {
          console.log("Token refresh failed:", refreshErr);
          res.sendStatus(403); // Forbidden
        }

        // Forbidden
      } else {
        // console.log(decoded);
        req.user = decoded; // Set req.user with the decoded user information
        req.token = token;
        next();
      }
    });
  } else {
    res.sendStatus(403); // Forbidden
  }
}

// async function refreshAccessToken(refreshToken) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
//       if (err) {
//         console.log("Refresh token verification failed:", err);
//         reject(err);
//       } else {
//         const user = decoded.user || decoded; // Assuming user is stored in decoded
//         const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, {
//           expiresIn: "10m",
//         });
//         resolve(accessToken);
//       }
//     });
//   });
// }
module.exports = {
  delete_image_from_post,
  get_posts,
  new_post,
  get_post_details,
  update_post,
  delete_post,
  verifyToken,
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
