const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./models/user");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      UserModel.findOne({ email: email, password: password }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "invalid username or password" });
        } else {
          return done(null, user, { message: "sucesss" });
        }
      });
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secretkey";

passport.use(
  new JWTStrategy(opts, (jwt_payload, done) => {
    UserModel.findById(jwt_payload.user._id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => console.log(err));
  })
);
exports.module = passport;
