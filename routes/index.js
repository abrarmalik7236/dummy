var express = require("express");
var router = express.Router();
var config = require("../env");

router.get("/", async function (req, res, next) {
  res.render("index", { title: config.appName });
});

module.exports = router;
