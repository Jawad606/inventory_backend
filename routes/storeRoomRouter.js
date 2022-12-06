const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// mongoose.set("debug", true);
var auth = require("../auth");
const cors = require("./cors");
const storeroom = require("../models/storeRoom");
const storeRoomRouter = express.Router();

storeRoomRouter.use(bodyParser.json());

storeRoomRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser,(req, res, next) => {
    storeroom
      .find(req.query)
      .populate("catagory")
      .populate("item")
      .then((storeRoom) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(storeRoom);
      });
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    var mongoObjectIdCat = mongoose.Types.ObjectId(req.body.cat);
    req.body.catId = mongoObjectIdCat;
    var mongoObjectIditem = mongoose.Types.ObjectId(req.body.cat);
    req.body.itemId = mongoObjectIditem;
    req.body.user = req.user._id;
    storeroom.create(req.body)
    .then((storeroom1) => {
      storeroom.findById(storeroom1._id)
        .populate("item")
        .populate("catagory")
        .then((storeroom) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(storeroom);
        });
    })
    .catch((err) => console.log(err))
  });
storeRoomRouter
  .route("/:storeId")
  .options(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res) => { res.sendStatus(200); })
  .put(cors.corsWithOptions, (req, res, next) => {
    storeroom.findByIdAndUpdate(
        req.params.storeId,
        {
          $set: req.body,
        },
        { new: true })
        .then((storeroom1) => {
          console.log("store ",storeroom1)
          storeroom.findById(storeroom1._id)
            .populate("item")
            .populate("catagory")
            .then((storeroom) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(storeroom);
            });
        })
        .catch((err) => console.log(err))
      });

module.exports = storeRoomRouter;
