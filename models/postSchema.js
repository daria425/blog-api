const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    is_published: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.virtual("url").get(function () {
  return `posts/${this._id}`;
});

module.exports = mongoose.model("Post", postSchema);
