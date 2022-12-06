const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");
const item = require("../models/item");
const itemsRouter = express.Router();

itemsRouter.use(bodyParser.json());

itemsRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser,(req, res, next) => {
    item
      .find()
      .populate("catId")
      .then((cat) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cat);
      });
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
    console.log(req.user._id)
    req.body.user = req.user._id;
    var mongoObjectId = mongoose.Types.ObjectId(req.body.catId);
    req.body.catId = mongoObjectId;
    item.create(req.body).then((items) => {
      item
        .findById(items._id)
        .populate("catId")
        .then((items) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(items);
        });
    });
  });

   
itemsRouter
.route("/:itemId")
.options(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin, (req, res) => {
  res.sendStatus(200);
})
.put(cors.corsWithOptions, (req, res, next) => {
  item.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((items) => {
      item.findById(items._id)
       .populate("catId")
        .then((items) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(items);
        });
    })
    .catch((err) => console.log(err));
})
.delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
  item.findByIdAndRemove(req.params.catId)
  .then((items) => {
    item.findById(items._id)
      .then((items) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(items);
      });
  })
  .catch((err) => console.log(err));
});


module.exports = itemsRouter;
