var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var compression = require("compression");
var jwt = require("jsonwebtoken");
var config = require("./env");
const createError = require("http-errors");
const port = process.env.PORT || 8080;

// Express Start
var app = express();
app.listen(port, () => {
  console.log("port running on " + port);
});
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);
app.set("Secret", config.secret);
app.use(cors());
app.use(express.static(__dirname + "/uploads"));
app.use(bodyParser.json({ limit: "9024mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "9024mb",
    parameterLimit: 10000,
    extended: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Header For Access
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Token"
  );
  next();
});

//  MiddleWares start
var checkToken = function (req, res, next) {
  var token = req.headers["accesstoken"];
  if (token) {
    jwt.verify(token, app.get("Secret"), (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

// Routes allow without token
var checkTokenFilter = function (req, res, next) {
  if (
    req._parsedUrl.pathname === "/" ||
    req._parsedUrl.pathname === "/app/uploader" ||
    req._parsedUrl.pathname === "/auth/login" ||
    req._parsedUrl.pathname === "/auth/signUp" ||
    req._parsedUrl.pathname === "/post/getAllAds" ||
    req._parsedUrl.pathname === "/dashboard/auth/login" ||
    req._parsedUrl.pathname === "/stripeconnect" ||
    req._parsedUrl.pathname === "/stripetransfer"
    ||
    req._parsedUrl.pathname === "/reauth"
  ) {
    next();
  } else {
    checkToken(req, res, next);
  }
};
//app.use(checkTokenFilter);

// ==========================================================
// ========================= Routessss =========================
// ==========================================================

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/app", require("./routes/app"));
app.use("/post", require("./routes/post"));
app.use("/chat", require("./routes/chat_route"));
// Dashboard
app.use("/dashboard/auth", require("./routes/dashboard/auth"));
app.use("/dashboard/dashboard", require("./routes/dashboard/dashboard"));
app.use("/dashboard/user", require("./routes/dashboard/user"));
app.use("/dashboard/post", require("./routes/dashboard/post"));
app.use("/stripeconnect", require("./routes/stripe_connect"));
app.use("/reauth", require("./routes/reauth"));
app.use("/stripetransfer", require("./routes/stripe_transfer"));

//app.use("/dashboard/chat", require("./routes/dashboard/post"));

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
