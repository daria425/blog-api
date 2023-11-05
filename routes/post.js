const Post = require("../models/postSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Category = require("../models/categorySchema");
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../services/cloudinary");

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
    res.status(500).send(err);
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
      console.log(req.body);
      const uploads = [];
      for (const file of req.files) {
        const path = file.path;
        const imageData = await uploadToCloudinary(path, "post-images");
        uploads.push({ public_id: imageData.public_id, url: imageData.url });
      }
      const imageSources =
        uploads.length > 0 ? [...uploads] : prevItem.image_sources;
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
      const savedAndUpdatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        updatedPost,
        { new: true }
      )
        .populate("category")
        .exec();
      console.log("post updated");
      res.status(200).send(savedAndUpdatedPost);
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
  upload.any(),
  async (req, res, next) => {
    try {
      const imageSources = [];
      console.log(req.files);
      if (typeof req.files !== "undefined") {
        for (const file of req.files) {
          const path = file.path;
          const imageData = await uploadToCloudinary(path, "post-images");
          console.log(imageData);
          imageSources.push({
            public_id: imageData.public_id,
            url: imageData.url,
          });
        }
      }

      console.log(req.body);
      const tags = JSON.parse(req.body.tags);
      const contentObj = JSON.parse(req.body.content);
      const newPost = new Post({
        title: req.body.title || "",
        content: contentObj,
        image_sources: imageSources,
        category: req.body.category,
        tags: tags,
        author: req.user.user._id,
        is_published: req.body.is_published,
      });
      const savedPost = await newPost.save();
      await Category.updateOne(
        { _id: req.body.category },
        { $push: { posts: savedPost._id } }
      );
      const populatedPost = await savedPost.populate("category");

      res.status(200).send(populatedPost);
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
      console.log(req.body);
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

const update_post_text = [
  verifyToken,
  async (req, res, next) => {
    try {
      const postToUpdate = await Post.findOne({ _id: req.params.id });
      postToUpdate.content.main_text = req.body.main_text;
      const updatedPost = await postToUpdate.save();
      res.status(200).send(updatedPost);
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
  update_post_text,
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
