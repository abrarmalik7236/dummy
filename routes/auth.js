var express = require("express");
var router = express.Router();
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var jwt = require("jsonwebtoken");
const { User } = require("../sequelize");
var passwordHash = require("password-hash");
var config = require("../env");
const nodemailer = require("nodemailer");

/* App Login */
router.post("/login", function (req, res, next) {
  User.findOne({
    where: {
      email: req.body.email,
      status: {
        [Op.not]: "Blocked",
      },
    },
  }).then((fetch) => {
    if (fetch != null) {
      if (passwordHash.verify(req.body.password, fetch.password)) {
        User.update(
          { token: req.body.token },
          { where: { email: req.body.email } }
        ).then((up) => {
          User.findOne({
            where: { id: fetch.id },
          }).then((user) => {
            const payload = { check: true };
            var token = jwt.sign(payload, config.secret, { expiresIn: "100d" });
            res.json({
              status: "success",
              data: { user, token },
            });
          });
        });
      } else {
        res.json({
          status: "failed",
          data: null,
        });
      }
    } else {
      res.json({
        status: "failed",
        data: null,
      });
    }
  });
});

/* App Signup */
router.post("/signup", function (req, res, next) {
  var body = req.body;
  var password = passwordHash.generate(body.password);
  body.password = password;
  User.count({ where: { email: body.email } }).then((count) => {
    if (count == 0) {
      User.create(body).then((user) => {
        const payload = { check: true };
        var token = jwt.sign(payload, config.secret, {
          expiresIn: 60 * 60 * 24 * 15,
        });
        User.findOne({
          where: { id: user.id },
        }).then((user) => {
          res.json({
            status: "success",
            message: "Welcome back",
            data: { user, token },
          });
        });
      });
    } else {
      res.json({
        status: "failed",
        message: "Email already exist",
        data: null,
      });
    }
  });
});

module.exports = router;
