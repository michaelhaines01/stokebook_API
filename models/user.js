let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicUrl: { type: String, default: "" },

  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sentfriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

//Export model
module.exports = mongoose.model("User", UserSchema);
