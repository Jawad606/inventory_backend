const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const paybill = require("../models/paybill");

const paybillRouter = express.Router();
paybillRouter.use(bodyParser.json());

paybillRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser, (req, res, next) => {
    paybill
      .find(req.query)
      .populate("vender")
      .populate("user")
      .populate("item")
      .populate("catagory")
      .then((paybill) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(paybill);
      });
  })
  .post(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      console.log("body  ", req.body);
      req.body.catagory = mongoose.Types.ObjectId(req.body.catagory);
      req.body.item = mongoose.Types.ObjectId(req.body.item);
      req.body.vender = mongoose.Types.ObjectId(req.body.vender);
      req.body.user = req.user._id;
      paybill
        .create(req.body)
        .then((payments) => {
          paybill
            .findById(payments._id)
            .populate("vender")
            .populate("user")
            .populate("item")
            .populate("catagory")
            .then((paybill) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(paybill);
            });
        })
        .catch((err) => console.log(err));
    }
  );
paybillRouter
  .route("/:payBID")
  .options(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res) => {
      res.sendStatus(200);
    }
  )
  .put(cors.corsWithOptions, (req, res, next) => {
    paybill
      .findByIdAndUpdate(
        req.params.payBID,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then((paybills) => {
        paybill
          .findById(paybills._id)
          .populate("vender")
          .populate("user")
          .populate("item")
          .populate("catagory")
          .then((payment) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(payment);
          });
      })
      .catch((err) => console.log(err));
  });

module.exports = paybillRouter;
