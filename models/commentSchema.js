const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: "Anon",
  },
});

module.exports = mongoose.model("Comment", commentSchema);
