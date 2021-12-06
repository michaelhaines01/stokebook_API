const User = require("../models/user");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const faker = require("faker");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cheerio = require("cheerio");
const axios = require("axios");

exports.registerUser = async (req, res) => {
  try {
    //b cyrpt eventually
    let newUser = new User({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      profilePicUrl: faker.image.imageUrl(),
    });
    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info.message,
        user: user,
        auth: false,
      });
    } else {
      jwt.sign({ user }, "secretkey", (err, token) => {
        return res.json({
          user,
          auth: true,
          message: "Success",
          token: "Bearer " + token,
        });
      });
    }
  })(req, res, next);
};

exports.createPost = async (req, res, next) => {
  try {
    let newPost = new Post({
      message: faker.lorem.words(),
      waveData: faker.datatype.json(),
      img: faker.image.imageUrl(),
      author: req.user._id,
    });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deletePost = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Success" });
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.requestFriend = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user.friends.includes(req.user.id)) {
        if (!user.friendRequests.includes(req.user.id)) {
          await User.findByIdAndUpdate(req.params.id, {
            $push: { friendRequests: req.user.id },
          });
          await User.findByIdAndUpdate(req.user.id, {
            $push: { sentfriendRequests: req.params.id },
          });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you already sent a friend requset");
        }
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      console.log("here");
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

exports.acceptFriendRequest = async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);
  const user = await User.findById(req.params.id);
  if (currentUser.sentfriendRequests.includes(req.params.id)) {
    if (user.friendRequests.includes(req.user.id)) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { friends: req.params.id },
        $pull: { sentfriendRequests: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $push: { friends: req.user.id },
        $pull: { friendRequests: req.user.id },
      });
      res.status(200).json("You are now friends");
    } else {
      res.status(403).json("Friend request has been canceled");
    }
  } else {
    res.status(403).json("Friend request not been found");
  }
};

exports.getPosts = async (req, res, next) => {
  let postArr = [];
  const user = await User.findById(req.user.id, "friends");
  for (let i = 0; i < user.friends.length; i++) {
    let posts = await Post.find({
      author: user.friends[i]._id,
      author: req.user._id,
    }).populate("author");
    postArr.push(posts);
  }
  res.status(200).json(postArr);
};
exports.getComments = async (req, res, next) => {
  try {
    let comments = await Comment.find({ post: req.params.id });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.createComment = async (req, res, next) => {
  try {
    let newComment = new Comment({
      post: req.params.id,
      content: faker.lorem.words(),
      user: req.user.id,
    });
    const comment = await newComment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Maybe illegal
exports.webscraper = () => {
  const url =
    "https://w3.vicports.vic.gov.au/WeatherService.svc/GetDailySummary";
  axios(url).then((response) => {
    const html = response.data;
    console.log(html);
  });
};
