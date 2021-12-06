var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  content: { type: String, required: true, maxLength: 250 },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comments", CommentsSchema);
