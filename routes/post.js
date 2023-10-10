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
      const decoded = jwt.verify(req.token, process.env.SECRET_KEY);
      if (decoded) {
        const newPost = new Post({
          title: req.title,
          content: req.content,
          author: req.user,
          comments: req.body.comments,
          is_published: req.body.is_published,
        });
        await newPost.save();
        res.sendStatus(200);
      }
    } catch (errors) {
      console.log(errors);
    }
  },
];
function verifyToken(req, res, next) {
  const bearerHeader = req.headers;
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
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
