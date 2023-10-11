const Post = require("../models/postSchema");
const jwt = require("jsonwebtoken");
const get_posts = async (req, res, next) => {
  try {
    const allPosts = await Post.find().exec();
    res.send(allPosts);
  } catch (err) {
    console.log(err);
  }
};

const new_post = [
  verifyToken,
  async (req, res, next) => {
    try {
      console.log(req);
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
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

module.exports = { get_posts, new_post };

//router.post("/posts", verifyToken, (req, res, next) => {
// jwt.verify(req.token, "svintus", (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.send({ message: "new message", authData });
//     }
//   });
// });
