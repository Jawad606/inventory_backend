var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var authenticate = require("./auth");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const config = require("./config");

const UniStore = require("./models/uniStore");
const catagory = require("./models/catagory");
const item = require("./models/item");
const assign = require("./models/assign");
const user = require("./models/user");
const vender = require("./models/vender");
const payment = require("./models/payment");

const mongoose = require("mongoose");
const url = config.mongoUrl;
console.log(url)
const connect =  mongoose.connect('mongodb://jawadmirza606:aRlURY3vRj9NrHz4@university-shard-00-00.vnke6.mongodb.net:27017,university-shard-00-01.vnke6.mongodb.net:27017,university-shard-00-02.vnke6.mongodb.net:27017/?ssl=true&replicaSet=atlas-tkd3ii-shard-0&authSource=admin&retryWrites=true&w=majority');
// const connect =  mongoose.connect('mongodb://localhost:27017/University');

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/usersRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(cookieParser('12345-67890-09876-54321'));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const uniStoreRouter = require("./routes/universityRouter");
const catRouter = require("./routes/catRouter");
const itemRouter = require("./routes/itemsRouter");
const storeRoomRouter = require("./routes/storeRoomRouter");
const assignRouter = require("./routes/assignRouter");
const assignStoreRoute = require("./routes/assignStoreRoute");
const venderRouter = require("./routes/venderRouter");
const payRouter = require("./routes/payRouter");
const paybillRouter = require("./routes/paybillRouter");
const empRouter = require("./routes/employeeRouter");
const specificRouter = require("./routes/specificationRouter");
const specificStoreRouter = require("./routes/specficStoreRouter");
const modeltagRouter = require("./routes/modeltagRouter");

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/university", uniStoreRouter);
app.use("/catagory", catRouter);
app.use("/item", itemRouter);
app.use("/store", storeRoomRouter);
app.use("/assign", assignRouter);
app.use("/assignStore", assignStoreRoute);
app.use("/vender", venderRouter);
app.use("/payment", payRouter);
app.use("/paybill", paybillRouter);
app.use("/employee", empRouter);
app.use("/specification", specificRouter);
app.use("/specificstore", specificStoreRouter);
app.use("/tag", modeltagRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
