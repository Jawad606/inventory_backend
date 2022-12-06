const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
const vender = require("../models/vender");
const venderRouter = express.Router();
venderRouter.use(bodyParser.json());
var auth = require("../auth");
venderRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser,(req, res, next) => {
    vender
      .find(req.query)
      .populate("item")
      .populate("catagory")
      .then((vender) => {
        res.setHeader("Content-Type", "application/json");
        res.statusCode=200;
        res.json(vender)
      }) .catch((err) => console.log(err));;
  })
 .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin,(req, res, next)=>{
  req.body.catagory = mongoose.Types.ObjectId(req.body.catagory);
  req.body.item = mongoose.Types.ObjectId(req.body.item);
  req.body.user = req.user._id;
   vender.create(req.body)
   .then((venders)=>{
    vender.findById(venders._id)
    .populate("item")
    .populate("catagory")
    .then((venderFind) => {
      console.log(venderFind)
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(venderFind);
    });
   }) .catch((err) => console.log(err));
 })


 venderRouter
 .route("/:venderId")
 .options(cors.corsWithOptions, (req, res) => {
   res.sendStatus(200);
 })
 .put(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
   vender.findByIdAndUpdate(
       req.params.venderId,
       {
         $set: req.body,
       },
       { new: true }
     )
     .then((venders) => {
       vender.findById(venders._id)
         .populate("item")
         .populate("catagory")
         .then((venders) => {
           res.statusCode = 200;
           res.setHeader("Content-Type", "application/json");
           res.json(venders);
         });
     })
     .catch((err) => console.log(err));
 })
 .delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin, (req, res, next) => {
   vender
     .findByIdAndRemove(req.params.venderId)
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


module.exports = venderRouter;
