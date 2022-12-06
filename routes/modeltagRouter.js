const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const modeltag = require("../models/modelTags");
const modeltagRouter = express.Router();

modeltagRouter.use(bodyParser.json());

modeltagRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser, (req, res, next) => {
    modeltag
      .find()
      .populate("catagory")
      .populate("item")
      .populate("specification")
      .populate("uniStore")
      .populate('assign')
      .then((tags) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(tags);
      });
  })
  .post(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      if (!req.body.user) {
        req.body.user = req.user._id;
      } else {
        req.body.user = mongoose.Types.ObjectId(req.body.user);
      }
      modeltag
        .create(req.body)
        .then((tags) => {
          modeltag
            .find()
            .populate("catagory")
            .populate("item")
            .populate("specification")
            .populate("uniStore")
            .populate('assign')
            .then((tag) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(tag);
            });
        })
        .catch((err) => console.log(err));
    }
  );

modeltagRouter
  .route("/")
  .options(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res) => {
      res.sendStatus(200);
    }
  )
  .put(cors.corsWithOptions, (req, res, next) => {
    req.body.forEach((item) => {
      modeltag.updateOne({_id: item._id}, item, {upsert: false}, (err, task) => {
              if (err) {
                console.log(err);
              }
      })
   })
   modeltag
    .find()
    .populate("catagory")
    .populate("item")
    .populate("specification")
    .populate("uniStore")
      .populate('assign')
   .then((tags) => {
     res.statusCode = 200;
     res.setHeader("Content-Type", "application/json");
     res.json(tags);
   });
  })
  .delete(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      modeltag
        .findByIdAndRemove(req.params.tagId)
        .then((tags) => {
          modeltag
            .findById(tags._id)
            .populate("catagory")
            .populate("item")
            .populate("specification")
            .populate('assign')
            .then((tags) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(tags);
            });
        })
        .catch((err) => console.log(err));
    }
  );

module.exports = modeltagRouter;
