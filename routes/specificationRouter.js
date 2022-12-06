const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const specification = require("../models/specifications");

const specificRouter = express.Router();
specificRouter.use(bodyParser.json());

specificRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser,  (req, res, next) => {
    specification
      .find(req.query)
      .populate('item')
      .populate('catagory')
      .populate('user')
      .then((specification) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(specification);
      });
  })
  .post(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      req.body.item = mongoose.Types.ObjectId(req.body.item);
      req.body.catagory = mongoose.Types.ObjectId(req.body.catagory);
      req.body.user = req.user._id;
      specification
        .create(req.body)
        .then((specifications) => {
          specification
            .findById(specifications._id)
            .populate('item')
            .populate('catagory')
            .populate('user')
            .then((specification) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(specification);
            });
        })
        .catch((err) => console.log(err));
    }
  );

  specificRouter
  .route("/:spcID")
  .options(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res) => {
      res.sendStatus(200);
    }
  )
  .put(cors.corsWithOptions, (req, res, next) => {
    specification
      .findByIdAndUpdate(
        req.params.spcID,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then((specifications) => {
        specification
          .findById(specifications._id)
          .populate('item')
          .populate('catagory')
          .populate('user')
          .then((specification) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(specification);
          });
      })
      .catch((err) => console.log(err));
  });

module.exports = specificRouter;
