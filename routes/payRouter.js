const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const payment = require("../models/payment");

const payRouter = express.Router();
payRouter.use(bodyParser.json());

payRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    payment
      .find(req.query)
      .populate("vender")
      .populate("uniStore")
      .populate('user')
      .then((payment) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(payment);
      });
  })
  .post(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      req.body.vender = mongoose.Types.ObjectId(req.body.vender);
      req.body.uniStore = mongoose.Types.ObjectId(req.body.uniStore);
      req.body.user = req.user._id;
      payment
        .create(req.body)
        .then((payments) => {
          payment
            .findById(payments._id)
            .populate("vender")
            .populate("uniStore")
            .populate('user')
            .then((payment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(payment);
            });
        })
        .catch((err) => console.log(err));
    }
  );

  payRouter
.route("/:payId")
.options(cors.corsWithOptions,auth.verifyUser, (req, res) => {
  res.sendStatus(200);
})
.put(cors.corsWithOptions, (req, res, next) => {
  payment.findByIdAndUpdate(
      req.params.payId,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((payments) => {
      payment.findById(payments._id)
      .populate("vender")
      .populate("uniStore")
      .populate('user')
        .then((payment) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(payment);
        });
    })
    .catch((err) => console.log(err));
})
.delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin,(req, res, next) => {
  payment.findByIdAndRemove(req.params.payId)
  .then((payments) => {
    payment.findById(payments._id)
      .then((payment) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(payment);
      });
  })
  .catch((err) => console.log(err));
});

module.exports = payRouter;
