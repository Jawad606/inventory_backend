const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
mongoose.set("debug", true);
const cors = require("./cors");
const assignStore = require("../models/assignStore");
const assignStoreRoute = express.Router();
var auth = require("../auth");
assignStoreRoute.use(bodyParser.json());

assignStoreRoute
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,auth.verifyUser, (req, res, next) => {
    assignStore.find(req.query)
      .populate("catagory")
      .populate("item")
      .then((assignStore) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(assignStore);
      });
  })
  .post(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin,(req, res, next) => {
    var mongoObjectIdCat = mongoose.Types.ObjectId(req.body.cat);
    req.body.catId = mongoObjectIdCat;
    var mongoObjectIditem = mongoose.Types.ObjectId(req.body.cat);
    req.body.itemId = mongoObjectIditem;
    req.body.user = req.user._id;
    assignStore.create(req.body)
    .then((assignStore1) => {
        assignStore.findById(assignStore1._id)
        .populate("item")
        .populate("catagory")
        .then((assignStore) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(assignStore);
        });
    })
    .catch((err) => console.log(err))
  });
assignStoreRoute
  .route("/:storeId")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .put(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    assignStore.findByIdAndUpdate(
        req.params.storeId,
        {
          $set: req.body,
        },
        { new: true })
        .then((assignStore1) => {
        assignStore.findById(assignStore1._id)
            .populate("item")
            .populate("catagory")
            .then((assignStore) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(assignStore);
            });
        })
        .catch((err) => console.log(err))
      });

module.exports = assignStoreRoute;
