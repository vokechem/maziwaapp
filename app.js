var createError = require("http-errors");
var express = require("express");
var Users = require("./routes/SystemAdmin/Users");
var usergroups = require("./routes/SystemAdmin/UserGroups");
var auth = require("./routes/SystemAdmin/auth");
var ValidateTokenExpiry = require("./routes/SystemAdmin/ValidateTokenExpiry");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});
app.use("/api/ValidateTokenExpiry", ValidateTokenExpiry);
app.use("/AuthToken", auth.router);

// app.use("/api/Signup", Signup);
app.use("/api/login", auth.router);
app.use(auth.validateToken);
app.use("/api/users", Users);
app.use("/api/usergroups", usergroups);
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
