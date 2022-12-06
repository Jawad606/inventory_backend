var express = require("express");
var router = express.Router();
var authenticate = require("../auth");
const bodyParser = require("body-parser");
var User = require("../models/user");
const cors = require("./cors");
var passport = require("passport");
router.use(bodyParser.json());

/* GET users listing. */
router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

router.post("/signup", cors.corsWithOptions, (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.designation) user.designation = req.body.designation;
        if (req.body.admin) user.admin = req.body.admin;

        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" });
          });
        });
      }
    }
  );
});
router.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Login Successful!",
        token: token,
        user: req.user,
      });
    });
  })(req, res, next);
});

router
  .route("/logout")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("session-id");
      req.logout();
      res.status(200).json({
        status: "Bye!",
      });
    } else {
      var err = new Error("You are not logged in!");
      err.status = 403;
      next(err);
      console.log("erroe");
    }
  });
router.route("/").options(cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

router.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

router
  .route("/changepassword/:userId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, function (req, res) {
    User.findOne({ _id: req.params.userId }, (err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: "User not found" }); // Return error, user was not found in db
        } else {
          user.changePassword(
            req.body.oldpassword,
            req.body.newpassword,
            function (err) {
              if (err) {
                if (err.name === "IncorrectPasswordError") {
                  res.json({ success: false, message: "Incorrect password" }); // Return error
                } else {
                  res.json({
                    success: false,
                    message:
                      "Something went wrong!! Please try again after sometimes.",
                  });
                }
              } else {
                res.json({
                  success: true,
                  message: "Your password has been changed successfully",
                });
              }
            }
          );
        }
      }
    });
  });

router
  .route("/reset")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    User.findOne({ username: req.body.username }).then((u) => {
      u.setPassword(req.body.password, (err, u) => {
        if (err) return next(err);
        u.save();
        res.status(200).json({ message: "password change successful" });
      });
    });
  });

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjIyYzljOTQyNjQ5YzQ3ZGMyNmMwMWMiLCJpYXQiOjE2NDY0NDcwNTcsImV4cCI6MTY0NjQ1MDY1N30.pcNknXffrvqaLsnHF5sz42W8hp8w2EoV5k0Rd_aXaaw
