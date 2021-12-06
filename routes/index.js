let express = require("express");
let router = express.Router();
const userControllers = require("../controllers/users");
const passport = require("passport");
/* GET home page. */
router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/webscraper", userControllers.webscraper);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  userControllers.createPost
);

router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  userControllers.getPosts
);
router.get(
  "/posts/:id/comments",
  passport.authenticate("jwt", { session: false }),
  userControllers.getComments
);
router.post(
  "/posts/:id/comments",
  passport.authenticate("jwt", { session: false }),
  userControllers.createComment
);

router.get(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  userControllers.deletePost
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  userControllers.getUser
);

router.get(
  "/requestFriend/:id",
  passport.authenticate("jwt", { session: false }),
  userControllers.requestFriend
);

router.get(
  "/acceptFriend/:id",
  passport.authenticate("jwt", { session: false }),
  userControllers.acceptFriendRequest
);

module.exports = router;
