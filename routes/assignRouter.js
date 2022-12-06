const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const assign = require("../models/assign");
const assignRouter = express.Router();
assignRouter.use(bodyParser.json());

assignRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,auth.verifyUser, (req, res, next) => {
    assign
      .find(req.query)
      .populate("item")
      .populate("catagory")
      .populate("employee")
      .populate('specification')
      .then((assignStore) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(assignStore);
      });
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    req.body.catagory = mongoose.Types.ObjectId(req.body.catagory);
    req.body.item = mongoose.Types.ObjectId(req.body.item);
    req.body.employee = mongoose.Types.ObjectId(req.body.employee);
    req.body.user = req.user._id;
    assign.create(req.body)
      .then((assignStore) => {
        assign.findById(assignStore._id)
          .populate("item")
          .populate('employee')
          .populate("catagory")
          .populate('specification')
          .then((assignStore) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(assignStore);
          });
      })
      .catch((err) => console.log(err));
  });

  assignRouter
  .route("/:assignId")
  .options(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    assign.findByIdAndUpdate(
        req.params.assignId,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then((assings) => {
        assign.findById(assings._id)
          .populate("item")
          .populate("catagory")
          .populate('employee')
          .then((assings) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(assings);
          });
      })
      .catch((err) => console.log(err));
  })
  .delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    assign
      .findByIdAndRemove(req.params.assignId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });


module.exports = assignRouter;
