const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);

var auth = require("../auth");

const catagory = require("../models/catagory");
const uniStore = require("../models/uniStore");
const catRouter = express.Router();

catRouter.use(bodyParser.json());

catRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors,auth.verifyUser, (req, res, next) => {
      catagory.find().then((cat) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cat);
      });
    
  })
  .post(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin,  (req, res, next) => {
   
    if(!req.body.user){
     req.body.user = req.user._id;
    }
    else{
      req.body.user = mongoose.Types.ObjectId(req.body.user);
    }
    catagory.create(req.body).then((cat) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(cat);
    });
  })
  
  
catRouter
.route("/:catId")
.options(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin,  (req, res) => {
  res.sendStatus(200);
})
.put(cors.corsWithOptions, (req, res, next) => {
  catagory.findByIdAndUpdate(
      req.params.catId,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((cata) => {
      catagory.findById(cata._id)
        .then((cata) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(cata);
        });
    })
    .catch((err) => console.log(err));
})
.delete(cors.corsWithOptions,auth.verifyUser,auth.verifyAdmin,(req, res, next) => {
  catagory.findByIdAndRemove(req.params.catId)
  .then((cata) => {
    catagory.findById(cata._id)
      .then((cata) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cata);
      });
  })
  .catch((err) => console.log(err));
});

module.exports = catRouter;
