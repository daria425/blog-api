const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      subheading: {
        type: String,
        default: "",
      },

      snippets: [
        {
          type: String,
          default: "",
        },
      ],

      main_text: {
        type: String,
        default: "",
      },
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
    image_sources: [
      {
        public_id: { type: String },
        url: {
          type: String,
        },
      },
    ],
    is_published: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    tags: [{ type: String, required: true }],
    likes: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

postSchema.virtual("url").get(function () {
  return `posts/${this._id}`;
});

module.exports = mongoose.model("Post", postSchema);
