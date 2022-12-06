const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const uniStore = require("../models/uniStore");
const uniStoreRouter = express.Router();

uniStoreRouter.use(bodyParser.json());

uniStoreRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,auth.verifyUser, (req, res, next) => {
    uniStore
      .find(req.query)
      .populate("item")
      .populate("catagory")
      // .populate("vender")
      .populate('specification')
      .then((uniStore) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(uniStore);
      });
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    req.body.catagory = mongoose.Types.ObjectId(req.body.catagory);
    req.body.item = mongoose.Types.ObjectId(req.body.item);
    req.body.vender = mongoose.Types.ObjectId(req.body.vender);
    req.body.specification = mongoose.Types.ObjectId(req.body.specification);
    req.body.user = req.user._id;
    uniStore.create(req.body)
      .then((uniStore1) => {
        uniStore.findById(uniStore1._id)
          .populate("item")
          .populate("catagory")
          // .populate("vender")
          .populate('specification')
          .then((uniStore) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(uniStore);
          });
      })
      .catch((err) => console.log(err));
  });

uniStoreRouter
  .route("/:uniId")
  .options(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res) => {
    res.sendStatus(200);
  })
  .put(cors.corsWithOptions, (req, res, next) => {
      uniStore.findByIdAndUpdate(
        req.params.uniId,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then((uniStore1) => {
        uniStore
          .findById(uniStore1._id)
          .populate("item")
          .populate("catagory")
          // .populate("vender")
          .populate('specification')
          .then((uniStore) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(uniStore);
          });
      })
      .catch((err) => console.log(err));
  })
  .delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    console.log(req.params.uniId);
    uniStore
      .findByIdAndRemove(req.params.uniId)
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

module.exports = uniStoreRouter;
