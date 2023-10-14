const Comment = require("../models/commentSchema");
const Post = require("../models/postSchema");

const new_comment_post = async (req, res, next) => {
  //comment input field name would be name='comment postID'
  try {
    const comment = new Comment({
      text: req.body.text,
      user: req.user._id || undefined,
    });
    const savedComment = await comment.save();
    await Post.updateOne(
      {
        _id: req.params.id,
      },
      { $push: { comments: savedComment._id } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.send(`Error: ${err}`);
  }
};

module.exports = {
  new_comment_post,
};
