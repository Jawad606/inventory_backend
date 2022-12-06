const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
mongoose.set("debug", true);
var auth = require("../auth");
const employee = require("../models/employees");

const empRouter = express.Router();
empRouter.use(bodyParser.json());

empRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, auth.verifyUser, (req, res, next) => {
    employee
      .find(req.query)
      .populate('user')
      .then((employee) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(employee);
      });
  })
  .post(
    cors.corsWithOptions,
    auth.verifyUser,
    auth.verifyAdmin,
    (req, res, next) => {
      req.body.user = req.user._id;
      employee
        .create(req.body)
        .then((employees) => {
          employee
            .findById(employees._id)
            .populate('user')
            .then((employee) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(employee);
            });
        })
        .catch((err) => console.log(err));
    }
  );

module.exports = empRouter;
