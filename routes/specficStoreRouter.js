const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
// mongoose.set("debug", true);
var auth = require("../auth");
const cors = require("./cors");
const specificstore = require("../models/specificStore");
const specificStoreRouter = express.Router();

specificStoreRouter.use(bodyParser.json());

specificStoreRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser,(req, res, next) => {
    specificstore
      .find(req.query)
      .populate("catagory")
      .populate("item")
      .populate('specification')
      .then((specificstore) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(specificstore);
      });
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    var mongoObjectIdCat = mongoose.Types.ObjectId(req.body.cat);
    req.body.catId = mongoObjectIdCat;
    var mongoObjectIditem = mongoose.Types.ObjectId(req.body.cat);
    req.body.itemId = mongoObjectIditem;
    req.body.user = req.user._id;
    specificstore.create(req.body)
    .then((storeroom1) => {
      specificstore.findById(storeroom1._id)
        .populate("item")
        .populate("catagory")
        .populate('specification')
        .then((specificstore) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(specificstore);
        });
    })
    .catch((err) => console.log(err))
  });
specificStoreRouter
  .route("/:storeId")
  .options(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res) => { res.sendStatus(200); })
  .put(cors.corsWithOptions, (req, res, next) => {
    specificstore.findByIdAndUpdate(
        req.params.storeId,
        {
          $set: req.body,
        },
        { new: true })
        .then((storeroom1) => {
          console.log("store ",storeroom1)
          specificstore.findById(storeroom1._id)
            .populate("item")
            .populate("catagory")
            .populate('specification')
            .then((specificstore) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(specificstore);
            });
        })
        .catch((err) => console.log(err))
      });

module.exports = specificStoreRouter;
