let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PostSchema = new Schema({
  message: { type: String, maxLength: 250, required: true },
  waveData: { type: String },
  img: { type: String },
  timestamp: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Post", PostSchema);
